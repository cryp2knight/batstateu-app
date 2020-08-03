import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobsService {

  currentUser: any

  constructor(private auth: AuthService) {
    this.currentUser = auth.userData$.getValue()
  }

  postAJob(job: any) {
    /**
     * job properties
     * position
     * salary
     * company
     * description
     * type
     * contactPerson (contains uid and name)
     * status (active or removed)
     * timestamp
     * 
     * saves job to jobs
     * save job to user profile
     */
    job.timestamp = firebase.database.ServerValue.TIMESTAMP
    job.contactPerson = {
      id: this.currentUser.usr_name,
      name: this.currentUser.usr_fullname
    }
    let key = firebase.database().ref("/jobs").push().key
    firebase.database().ref("/jobs/" + key)
      .set(job)
      .then(() => {
        console.log(`job ${job.position} at ${job.company} is posted!`)
      })

    firebase.database().ref("/users/" + this.currentUser.usr_name + "/jobs/posted/" + key)
      .set({
        timestamp: job.timestamp
      })
      .then(() => {
        console.log(`job ${key} saved to user ${this.currentUser.usr_name}`)
      })
  }

  applyToJob(id: string) {
    /**
     * id -> job id
     * save job to user profile
     * save applicant data to job
     */
    let time = firebase.database.ServerValue.TIMESTAMP
    firebase.database().ref("/jobs/" + id + "/applicants/" + this.currentUser.usr_name)
      .set({
        timestamp: time
      }).then(() => {
        console.log(`user ${this.currentUser.usr_name} applied to job ${id}`)
      })

    firebase.database().ref("/users/" + this.currentUser.usr_name + "/jobs/applied/" + id)
      .set({
        timestamp: time
      }).then(() => {
        console.log(`job ${id} saved to user ${this.currentUser.usr_name}`)
      })
  }

  updateJob(id: string, job: any) {
    /**
     * data should contain one of these properties
     * position
     * salary
     * company
     * description
     * type
     * status
     * 
     * updates job details
     * 
     */
    firebase.database().ref("/jobs/" + id)
      .update(job)
      .then(() => {
        console.log(`job ${job.position} at ${job.company} is updated!`)
      })
  }

  getJob(id: string) {
    /**
     * retrieves the job details
     * 
     */
    return new Observable(observer => {
      firebase.database().ref("/jobs/" + id)
        .once("value", snapshot => {
          let job = snapshot.val()
          job.key = snapshot.key
          observer.next(snapshot.val())
        })
    })
  }

  getJobs(limit: number) {
    /**
     * return the last posted jobs
     * using a promise
     * call it on start of before loadNextJobs()
     * 
     * only shows active jobs
     */
    let promise = new Promise((resolve, reject) => {
      let temp_job = []
      firebase.database().ref("jobs")
        .orderByKey()
        .limitToLast(limit)
        .once("value", snapshot => {
          snapshot.forEach(job => {
            let temp = job.val()
            temp.key = job.key
            if (temp.status === 'active') {
              temp_job.push(temp)
            }
          })
          console.log("jobs loaded")
          resolve(temp_job)
        }, (error) => {
          reject(error)
        })
    })
    return promise
  }

  loadNextJobs(limit: number = 5, lastKey: string) {
    /**
     * function for loading next jobs
     * on a scrollable content
     * returns a promise
     * 
     * has to run the getJobs function first
     * 
     * only shows active jobs
     */
    let promise = new Promise((resolve, reject) => {
      let temp_job = []
      firebase.database().ref("jobs")
        .orderByKey()
        .endAt(lastKey)
        .limitToLast(limit)
        .once("value", snapshot => {
          snapshot.forEach(job => {
            let temp = job.val()
            temp.key = job.key
            if (temp.status === 'active') {
              temp_job.push(temp)
            }
          })
          console.log("next jobs loaded")
          resolve(temp_job)
        }, error => {
          reject(error)
        })
    })
    return promise
  }

  viewApplicants(uid: string, jobid: string) {
    /**
     * checks whether the viewer is the poster
     * of the job if so it returns the list of
     * all the applicants for that job
     */
    this.getJob(jobid).subscribe(res => {
      let job: any = res
      if (uid === job.contactPerson.uid) {
        return new Observable(observer => {
          firebase.database().ref("jobs/" + jobid + "/applicants")
            .once("value", snapshot => {
              observer.next(snapshot.val())
            })
        })
      }
    })
  }

  getAppliedJobs() {
    /**
     * returns the list of jobs applied by users
     */
    return new Observable(observer => {
      firebase.database().ref("users/" + this.currentUser.usr_name + "/jobs/applied")
        .once("value", snaphsot => {
          observer.next(snaphsot.val())
        })
    })
  }

  getPostedJobs() {
    /**
     * returns the list of jobs posted by users
     */
    return new Observable(observer => {
      firebase.database().ref("users/" + this.currentUser.usr_name + "/jobs/posted")
        .once("value", snaphsot => {
          observer.next(snaphsot.val())
        })
    })
  }

}
