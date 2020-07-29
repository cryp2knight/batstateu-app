import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { NavParams, ModalController } from '@ionic/angular';
import * as $ from 'jquery'

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  inputText: string = ''
  currentPost: any
  key: string
  disabled = false
  pics = []
  fileCounter: number = 0
  filesToBeUploaded: any = {}
  imagesToBeRemoved: any = {}
  mustRemove: any = {}
  editedImageString:string = ''

  constructor(
    private feedService: FeedService,
    public navParams: NavParams,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.feedService.getPost(this.key).then((data) => {
      this.currentPost = data
      this.inputText = this.currentPost.post
      if (this.currentPost.images) {
        for (let i in this.currentPost.images) {
          this.pics.push({
            id: i,
            src: this.currentPost.images[i].url
          })
          this.imagesToBeRemoved[i] = this.currentPost.images[i].url
          this.fileCounter = parseInt(i)
        }
        this.fileCounter++
      }
    })
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

  
  removePic(id) {
    //removes from thumbnails
    let i = 0
    for (let pic of this.pics) {
      if (pic.id === id) {
        if (pic.id in this.imagesToBeRemoved){
          this.mustRemove[pic.id] = this.imagesToBeRemoved[pic.id]
        }
        this.pics.splice(i, 1)
      }
      i++
    }
    //do not include to upload
    delete this.filesToBeUploaded[id]
  }

  // uploads multiple images and return an array of urls of the uploaded images
  uploadImages() {
    return new Promise(async (resolve, reject) => {
      let urls = {}
      $(".loadpics").addClass('loader')
      for (let file in this.filesToBeUploaded) {
        let img = await this.feedService.uploadImage(this.filesToBeUploaded[file], file)
        this.removePic(parseInt(img[1]))
        urls[file]= { url: img[0] }
      }
      resolve(urls)
    })
  }

  removed = {} //removed images for edit history 
  added = {} // added images for edit history
  updatePost(){
    this.disabled = true
    this.feedService.removeImage(this.mustRemove, this.key).then(()=>{
      for (let i in this.mustRemove){
        this.removed[i] = this.mustRemove[i]
      }
      return
    }).then(()=>{
      return this.uploadImages().then(urls =>{
        let ur:any = urls
        for (let i in ur){
          this.added[i] = ur[i].url
        }
        this.feedService.updateImage(urls, this.key)
      })
    }).then(()=>{
      return this.feedService.editPost(this.currentPost, this.inputText, {added: this.added, removed: this.removed})
    }).then(()=>{
      console.log("edited successfully")
      this.closeModal()
    })
  }

  closeModal() {
    this.modalController.dismiss()
  }

}
