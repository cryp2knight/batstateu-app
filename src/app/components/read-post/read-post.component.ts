import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, PopoverController } from '@ionic/angular';
import { FullImageComponent } from '../full-image/full-image.component';
import { PopoverComponent } from '../popover/popover.component';
import { FeedService } from 'src/app/services/feed.service';
import { EditHistoryComponent } from '../edit-history/edit-history.component';

@Component({
  selector: 'app-read-post',
  templateUrl: './read-post.component.html',
  styleUrls: ['./read-post.component.scss'],
})
export class ReadPostComponent implements OnInit {

  currentUser
  post
  constructor(public navParams: NavParams,
    public modalController: ModalController,
    private popoverController: PopoverController,
    private feedService: FeedService,
  ) {
    this.post = navParams.get('data')
    this.currentUser = this.post.uid
  }

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

  async viewEditHistory(ev: any) {
    const popover = await this.popoverController.create({
      component: EditHistoryComponent,
      event: ev,
      translucent: true,
      componentProps: {
       edits: this.post.edits
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


  toDate(timestamp) {
    return new Date(timestamp)
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

  ngOnInit() { }

  closeModal() {
    this.modalController.dismiss()
  }

}
