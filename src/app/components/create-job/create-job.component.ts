import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CustomToolsService } from 'src/app/services/custom-tools.service';
import { ModalController } from '@ionic/angular';
import { JobsService } from 'src/app/services/jobs.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private tools: CustomToolsService,
    private modalController: ModalController,
    private toastService: ToastService,
    private jobService: JobsService
  ) { }

  authUser: any

  //inputs
  inputPosition: string = ""
  inputCompany: string = ""
  inputDescription: string = ""
  inputSalary: number = 0
  inputType: string = ""

  ngOnInit() {
    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
      this.jobService = new JobsService(this.authUser)
    })
  }

  closeModal() {
    this.modalController.dismiss()
  }

  getData() {
    let data: any = {
      position: this.inputPosition,
      company: this.inputCompany,
      description: this.inputDescription,
      type: this.inputType,
    }

    let isValid = true
    for (let i in data) {
      if (!this.tools.validateInput(data[i])) {
        isValid = false
        break
      }
    }

    data.salary = this.inputSalary

    if (isValid) {
      this.jobService.postAJob(data)
      this.closeModal()
    }else{
      this.toastService.presentToast("pls complete all the required fields")
    }
  }



}
