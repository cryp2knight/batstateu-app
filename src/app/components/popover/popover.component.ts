import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, AlertController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase'
import {  Router } from '@angular/router';
import { EditPostComponent } from '../edit-post/edit-post.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popover: PopoverController,
    public navParams: NavParams, private alertController: AlertController, 
    private modalController: ModalController,
    private router: Router) { }

  ngOnInit() { }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('deleting...');
            this.delete()
          }
        }
      ]
    });

    await alert.present();
  }

  async edit() {
    this.closePopover()
    const modal = await this.modalController.create({
      component: EditPostComponent,
      componentProps: {
        key: this.navParams.get("key")
      }
    });
    modal.present()
  }


  delete() {
    let key = this.navParams.get("key")
    firebase.database().ref("forums/" + key).remove(
      (error) => {
        if (error) {
          console.log(error.message)
        } else {
          console.log("post deleted")
          this.closePopover()
        }
      }
    )
  }

  closePopover() {
    this.popover.dismiss()
  }

}
