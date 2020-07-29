import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-history',
  templateUrl: './edit-history.component.html',
  styleUrls: ['./edit-history.component.scss'],
})
export class EditHistoryComponent implements OnInit {
  edits
  constructor(
    public navParams: NavParams,
    private modalController: ModalController
  ) {
    this.edits = navParams.get('edits')
  }

  closeModal(){
    this.modalController.dismiss()
  }

  toDate(timestamp){
    return new Date(timestamp)
  } 
  ngOnInit() {

  }

}

