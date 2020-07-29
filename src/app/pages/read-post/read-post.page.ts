import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { FullImageComponent } from '../../components/full-image/full-image.component';
import { PopoverComponent } from '../../components/popover/popover.component';
import { FeedService } from 'src/app/services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomToolsService } from 'src/app/services/custom-tools.service';
import { EditHistoryComponent } from 'src/app/components/edit-history/edit-history.component';

@Component({
  selector: 'app-read-post',
  templateUrl: './read-post.page.html',
  styleUrls: ['./read-post.page.scss'],
})
export class ReadPostPage implements OnInit {
  post
  authUser //full object
  inputComment

  constructor(
    private auth: AuthService,
    public modalController: ModalController,
    private popoverController: PopoverController,
    private feedService: FeedService,
    private route: ActivatedRoute,
    private tools: CustomToolsService,
    private alertController: AlertController
  ) { }

  // presenting pop over for delete and edit post
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        key: ev
      }
    });
    return await popover.present();
  }

  doLike(id, isLiked, index) {
    if (isLiked) {
      this.feedService.unLikePost(id)
      this.post.isLikedByUser = false
      this.post.likeCount--
    } else {
      this.feedService.likePost(id)
      this.post.isLikedByUser = true
      this.post.likeCount++
    }
  }

  doRefresh(event) {

    this.load().then(()=>{
      event.target.complete()
    })
  }

  async viewEditHistory(ev: any) {
    const modal = await this.modalController.create({
      component: EditHistoryComponent,
      componentProps: {
       edits: this.post.edits
      }
    });
    return await modal.present();
  }


  async presentDeleteComment(key) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Delete this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Yes',
          handler: () => {
            this.feedService.deleteComment(this.post.key, key).then(()=>{
              this.load()
            })
          }
        }
      ]
    });

    await alert.present();
  }
  toDate(timestamp) {
    return new Date(timestamp)
  }

  comment() {
    if (this.tools.validateInput(this.inputComment)) {
      let data = {
        name: this.tools.toTitleCase(this.authUser.usr_fullname),
        photoUrl: this.authUser.photo_url,
        uid: this.authUser.usr_name,
        comment: this.inputComment,
        timestamp: Date.now()
      }
      this.feedService.commentToPost(this.post.key, data).then(() => {
        this.inputComment = ''
        this.load()
      })
    }
  }


  async load(){
    this.feedService.getPost(this.post.key).then(data => {
      this.post = data
    })
  }

  async viewImage(url) {
    const modal = await this.modalController.create({
      component: FullImageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'url': url
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
    })
    let key = ''
    this.route.queryParams.subscribe(res => {
      key = res.key
      this.feedService.getPost(key).then(data => {
        this.post = data
      })
    })
  }


}
