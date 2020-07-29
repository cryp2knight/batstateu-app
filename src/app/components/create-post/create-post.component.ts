import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { AuthService } from 'src/app/services/auth.service';
import { CustomToolsService } from 'src/app/services/custom-tools.service'
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  public authUser: any;
  inputText: string = ''
  filesToBeUploaded: any = {}
  fileCounter: number = 0
  pics = []
  disabled: boolean = false

  constructor(
    private auth: AuthService,
    private tools: CustomToolsService,
    private modalController: ModalController,
    private toastService: ToastService,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
    })
  }

  closeModal() {
    this.modalController.dismiss()
  }

  // handles file input and display it as thumbnail when selecting images
  handleFileInput(event) {
    let input = event.target
    let pp = this.pics
    if (input.files) {
      let filesAmount = input.files.length;
      let counter = this.fileCounter
      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        reader.onload = function (event) {
          pp.push({ src: event.target.result, id: counter })
          counter++
        }
        reader.readAsDataURL(input.files[i]);
        this.filesToBeUploaded[this.fileCounter] = input.files[i]
        this.fileCounter++
      }
    }
  }

  //abstracted the uploading method to single function for the template to use
  uploadPost(post) {
    this.disabled = true
    this.uploadImages().then((photo_url) => {
      this.writePost(post, photo_url)
    })
  }

  // save post data to firebase
  writePost(post, pics = null) {
    post = post.trim()
    if (this.tools.validateInput(post)) {
      var data = {
        uid: this.authUser.usr_name,
        name: this.tools.toTitleCase(this.authUser.usr_fullname),
        photoUrl: this.authUser.photo_url,
        post: post,
        images: pics,
        timestamp: -Date.now()
      }

      this.feedService.writePost(data).then(()=>{
        this.toastService.presentToast('Posted successfully')
        this.closeModal()
      })
    }
  }

 

  // uploads multiple images and return an array of urls of the uploaded images
  uploadImages() {
    return new Promise(async (resolve, reject) => {
      let urls = []
      $(".loadpics").addClass('loader')
      for (let file in this.filesToBeUploaded) {
        let img = await this.feedService.uploadImage(this.filesToBeUploaded[file], file)
        this.removePic(parseInt(img[1]))
        urls.push({ url: img[0] })
      }
      resolve(urls)
    })
  }

  // removes pic thumbnails and from filesTobeupliaded dict when file uploaded
  removePic(id) {
    let i = 0
    for (let pic of this.pics) {
      if (pic.id === id) {
        this.pics.splice(i, 1)
      }
      i++
    }
    delete this.filesToBeUploaded[id]
  }

}
