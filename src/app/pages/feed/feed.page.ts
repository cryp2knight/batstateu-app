import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';
import { PopoverController, ModalController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { CreatePostComponent } from 'src/app/components/create-post/create-post.component'
import { FeedService } from 'src/app/services/feed.service';
import { IonInfiniteScroll } from '@ionic/angular'
import { FullImageComponent } from 'src/app/components/full-image/full-image.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false })

  infiniteScroll: IonInfiniteScroll
  lastKey: string = ""
  posts = []
  isFinished = false
  limit = 4
  authUser: any;

  constructor(
    private auth: AuthService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public feedService: FeedService,
    public navControl: NavController
  ) { }

  ngOnInit() {
    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
    })
    this.load()
  }

  async load(){
    this.loadPosts()
    this.postAdded()
    this.postDeleted()
  }

  // navigating to the read post page
  viewPost(post) {
    this.navControl.navigateForward(['home/feed/read-post'], {queryParams:{
      key: post.key
    }})
  }

  async viewImage(url) {
    const modal = await this.modalController.create({
      component: FullImageComponent,
      componentProps: {
        'url': url
      }
    });
    return await modal.present();
  }

  doRefresh(event) {
    this.posts = []
    this.lastKey = ""
    this.isFinished = false
    this.load().then(()=>{
      event.target.complete()
    })
  }

  // presenting the create post modal
  async createPost() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
    });
    return await modal.present();
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

  doLike(id, isLiked, index) {
    if (isLiked) {
      this.feedService.unLikePost(id)
      this.posts[index].isLikedByUser = false
      this.posts[index].likeCount--
    } else {
      this.feedService.likePost(id)
      this.posts[index].isLikedByUser = true
      this.posts[index].likeCount++
    }
  }

  //loading the first set of posts and saving it to posts array
  loadPosts() {
    this.feedService.getPosts(this.limit).then((data: any) => {
      data.reverse()
      this.posts.push(...data)
      this.lastKey = this.posts[this.posts.length - 1].key
    })
  }

  //loading the next set of posts and appending it to the posts array
  loadNextPosts(event) {
    this.feedService.loadNextPosts(this.limit, this.lastKey).then((data: any) => {
      data.pop() //remove the first elemnt from array
      data.reverse()
      this.posts.push(...data)
      event.target.complete()
      this.lastKey = this.posts[this.posts.length - 1].key
    })
  }

  // listener for when another post is posted, goes to very start of feed
  postAdded() {
    firebase.database().ref("forums").on("child_added", snapshot => {
      let temp = snapshot.val()
      temp.key = snapshot.key
      temp.likeCount = this.feedService.countLike(snapshot.val().likes)
      temp.isLikedByUser = this.feedService.isLikedByUser(snapshot.val().likes)
      console.log("images",temp.images)
      if (this.posts.length !== 0)
        this.posts.unshift(temp)
    })
  }

  // listener for when a post is deleted, removes the post from the posts array
  postDeleted() {
    firebase.database().ref("forums").on("child_removed", (snapshot) => {
      console.log("a post was deleted...")
      if (this.posts.length !== 0) {
        let i = 0
        for (let post of this.posts) {
          if (post.key === snapshot.key) {
            this.posts.splice(i, 1)
          }
          i++
        }
      }
    })
  }

  // converts the timestamp to date object
  toDate(time) {
    return new Date(time)
  }

  logoutAction() {
    this.auth.logout()
  }

}
