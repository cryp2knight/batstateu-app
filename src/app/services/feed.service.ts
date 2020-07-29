import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  database = firebase.database()
  currentUser
  fullName
  public posts: any
  public currentPost: any
  public limit: number = 10

  constructor(private auth: AuthService) {
    this.auth.userData$.subscribe((res: any) => {
      this.currentUser = res.usr_name
      this.fullName = res.fullname
    })
    // this.currentUser = firebase.auth().currentUser.uid
  }

  getPosts(limit) {
    let promise = new Promise((resolve, reject) => {
      let temp_post = []
      this.database.ref("forums")
        .orderByKey()
        .limitToLast(limit)
        .once("value", snapshot => {
          snapshot.forEach(post => {
            let temp = post.val()
            temp.key = post.key
            temp.likeCount = this.countLike(post.val().likes)
            temp.isLikedByUser = this.isLikedByUser(post.val().likes)
            temp.commentCount = this.countComment(post.val().comments)
            temp_post.push(temp)
          })
          console.log("posts loaded")
          resolve(temp_post)
        }, (error) => {
          reject(error)
        })
    })
    return promise
  }

  loadNextPosts(limit = 5, lastKey) {
    let promise = new Promise((resolve, reject) => {
      let temp_post = []
      firebase.database().ref("forums")
        .orderByKey()
        .endAt(lastKey)
        .limitToLast(limit)
        .once("value", snapshot => {
          snapshot.forEach(post => {
            let temp = post.val()
            temp.key = post.key
            temp.likeCount = this.countLike(post.val().likes)
            temp.commentCount = this.countComment(post.val().comments)
            temp.isLikedByUser = this.isLikedByUser(post.val().likes)
            temp_post.push(temp)
          })
          console.log("next posts loaded")
          resolve(temp_post)
        }, (error) => {
          reject(error)
        })
    })
    return promise
  }

  writePost(data) {
    return new Promise((resolve, reject) => {
      let key = firebase.database().ref("forums").push().key
      //save data under forums
      firebase.database().ref("forums").child(key).set(data).then((e) => {
        //save data to user profile
        firebase.database().ref('users/' + this.currentUser + '/posts/' + key).set({
          createdOn: data.timestamp
        }).then((f) => {
          console.log('Posted successfully')
          resolve()
        }).catch(er => {
          reject(er)
        })
      })
    })
  }

  async commentToPost(postId, data){
    let key = this.database.ref("forums/"+postId+"/comments").push().key
    this.database.ref("forums/"+postId+"/comments/"+key).set(data).then(()=>{
      this.database.ref("users/"+this.currentUser+"/commentedPost/"+postId+"/"+key).set(data)
    })
  }

  async deleteComment(postId, key){
    this.database.ref("forums/"+postId+"/comments/"+key).remove()
    this.database.ref("users/"+this.currentUser+"/commentedPost/"+postId+"/"+key).remove()
  }

  countComment(item) {
    if (item) {
      return Object.keys(item).length
    }
    return 0
  }

  likePost(postId) {
    let data = {
      likeOn: firebase.database.ServerValue.TIMESTAMP
    }
    this.database.ref("forums/" + postId + "/likes/" + this.currentUser)
      .set(data, (error) => {
        if (error) console.log(error)
        // add to profile when successfully like post
        else this.addLikedPostToProfile(postId, data)
      })
  }

  addLikedPostToProfile(postId, data) {
    this.database.ref("users/" + this.currentUser + "/likePosts/" + postId)
      .set(data, (error) => {
        if (error) console.log(error)
        else console.log("post liked and saved to profile")
      })
  }

  unLikePost(postId) {
    this.database.ref("forums/" + postId + "/likes/" + this.currentUser)
      .remove()
      .then(() => {
        // remove from profile when unliked successfully
        this.removeLikedPostFromProfile(postId)
      }).catch((error) => {
        console.log(error)
      })
  }

  removeLikedPostFromProfile(postId) {
    this.database.ref("users/" + this.currentUser + "/likePosts/" + postId)
      .remove()
      .then(() => {
        console.log("post unliked and removed from profile")
      }).catch((error) => {
        console.log(error)
      })
  }

  //post specific methods

  getPost(postId) {
    return new Promise((resolve, reject) => {
      let temp =
        this.database.ref("forums/" + postId)
          .once("value", (post) => {
            let temp = post.val()
            temp.key = post.key
            temp.likeCount = this.countLike(post.val().likes)
            temp.commentCount = this.countComment(post.val().comments)
            temp.isLikedByUser = this.isLikedByUser(post.val().likes)
            console.log(temp)
            resolve(temp)
          })
    })
  }

  isLikedByUser(item) {
    if (item) {
      if (this.currentUser in item)
        return true
    }
    return false
  }

  countLike(item) {
    if (item) {
      return Object.keys(item).length
    }
    return 0
  }

  getPostImages(item) {
    return Object.values(item.images)
  }


  editPost(currentPost, editedPost, imgedit = null) {
    firebase.database().ref('forums/' + currentPost.key).update({
      post: String(editedPost).trim(),
    }).then(() => {
      this.makeEditHistory(currentPost, editedPost, imgedit)
    })
  }

  makeEditHistory(post, newEdit: string, imgEdit) {
    firebase.database().ref('forums/' + post.key + '/edits').push().set({
      editedOn: -Date.now(),
      postBeforeEdit: post.post,
      postAfterEdit: newEdit.trim(),
      images: imgEdit
    }).then(() => {
      console.log("edit history successful")
    })
  }

  // uploads single image
  uploadImage(file, i) {
    // takes a file and an index as an argument
    let img = {
      url: '',
      name: '',
    }
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref("forums/images/" + this.currentUser + "/" + Date.now())
      let task = storageRef.put(file);
      task.on('state_changed', function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("image " + i + ":", percentage, "% uploaded...");
      },
        function (error) {
          reject(error)
        },
        function complete() {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            resolve([downloadURL, i])
          });
        });
    })
  }

  updateImage(urls, key) {
    return this.database.ref('forums/' + key + "/images").update(urls)
  }

  removeImage(urls, key) {
    return new Promise((resolve, reject) => {
      for (let i in urls) {
        this.database.ref('forums/' + key + "/images/" + i).remove()
      }
      resolve()
    })
  }

}
