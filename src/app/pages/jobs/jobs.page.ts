import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { JobsService } from 'src/app/services/jobs.service';
import { ModalController } from '@ionic/angular';
import { CreateJobComponent } from 'src/app/components/create-job/create-job.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {

  constructor(
    private auth: AuthService,
    private jobsService: JobsService,
    private modalController: ModalController,
  ) { }

 
  authUser:any

  jobs = []
  lastKey:string
  limit = 10

  ngOnInit() {
    this.auth.userData$.subscribe((res:any) => {
      this.authUser = res
      this.jobsService = new JobsService(this.auth)

      //load jobs
      this.jobsService.getJobs(this.limit)
      .then((jobs:any) => {
        jobs.reverse()
        this.jobs.push(...jobs)
        this.lastKey = this.jobs[this.jobs.length - 1].key
      })
    })
  }

  toDate(timestamp){
    return new Date(timestamp)
  }

  loadNextJobs(event){
    // this.jobsService.loadNextJobs(this.limit, this.lastKey)
    // .then((jobs:any)=>{
    //   jobs.pop()
    //   jobs.reverse()
    //   this.jobs.push(...jobs)
    //   event.target.complete()
    //   this.lastKey = this.jobs[this.jobs.length -1].key
    // })
  }

  applyToJob(job_id){
    this.jobsService.applyToJob(job_id)
  }

  async addJob(ev: any){
    const modal =  await this.modalController.create({
      component: CreateJobComponent,
      componentProps: {
        uid: this.authUser.usr_name
      }
    })
    return await modal.present()
  }

}
