import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  currentUser: any

  constructor(private auth: AuthService) {
    this.currentUser = auth.userData$.getValue()
  }

  getUsers(): Observable<any> {
    return new Observable(observer => {
      firebase.database().ref("messages/users").on('child_added', snapshot => {
        observer.next(snapshot)
      })
    })
  }

  getUser(id):Observable<any>{
    return new Observable(observer=>{
      firebase.database().ref("messages/users/"+id).once('value', snapshot => {
        observer.next(snapshot.val())
      })
    })
  }

  getMessages(uid): Observable<any> {
    return new Observable(observer => {
      firebase.database().ref("messages/messages/" + this.currentUser.usr_name + "/chats/" + uid)
        .on("child_added", snapshot => {
          observer.next(snapshot)
        })
    })
  }

  getChats(): Observable<any> {
    return new Observable(observer => {
      firebase.database().ref("messages/messages/" + this.currentUser.usr_name + "/summary")
        .on("child_changed", snapshot => {
          observer.next({snap: snapshot, changed: true})
        })
        firebase.database().ref("messages/messages/" + this.currentUser.usr_name + "/summary")
        .on("child_added", snapshot => {
          observer.next({snap: snapshot, added: true})
        })
    })
  }


  sendMessage(uid, msg, dest) {
    let key = firebase
      .database()
      .ref("messages/messages/" + this.currentUser.usr_name + "/chats/" + uid)
      .push().key;
    let data = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      source: this.currentUser.usr_name,
      destination: uid,
      sourceData: this.currentUser,
      destinationData: dest,
      message: msg,
    };


    firebase
      .database()
      .ref("messages/messages/" + uid + "/summary/" + this.currentUser.usr_name + "/last")
      .set(data)
      .catch(er => {
        console.log(er)
        return false
      })

    firebase
      .database()
      .ref("messages/messages/" + this.currentUser.usr_name + "/summary/" + uid + "/last")
      .set(data)
      .catch(er => {
        console.log(er)
        return false
      })

    firebase
      .database()
      .ref("messages/messages/" + uid + "/chats/" + this.currentUser.usr_name + "/" + key)
      .set(data)
      .catch(er => {
        console.log(er)
        return false
      })
    firebase
      .database()
      .ref("messages/messages/" + this.currentUser.usr_name + "/chats/" + uid + "/" + key)
      .set(data)
      .then(() => {
        // clear the textbox
        return true
      })
      .catch(er => {
        console.log(er)
        return false
      })
  }

   // uploads single image
   uploadImage(file) {
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref("messages/images/" + this.currentUser.usr_name + "/" + Date.now())
      let task = storageRef.put(file);
      task.on('state_changed', function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("image :", percentage, "% uploaded...");
      },
        function (error) {
          reject(error)
        },
        function complete() {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            resolve('<img src="'+downloadURL+'">')
          });
        });
    })
  }
  
}
