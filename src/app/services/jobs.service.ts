import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  currentUser: any

  constructor(private auth: AuthService) {
    this.currentUser = auth.userData$.getValue()
  }

  postJob(job){
    /**
     * job properties
     * position
     * salary
     * company
     * description
     * type
     * contactPerson
     * timestamp
     */
    job.timestamp = firebase.database.ServerValue.TIMESTAMP
    let key = firebase.database().ref("/jobs").push().key
    firebase.database().ref("/jobs/"+key)
    .set(job)
    .then(()=>{
      console.log(`job ${job.position} at ${job.company} is posted!`)
    })

    firebase.database().ref("/users/"+this.currentUser.usr_name+"/jobs/posted/"+key)
    .set(job)
    .then(()=> {
      console.log("job saved to profile!")
    })
  }


}
