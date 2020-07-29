import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-full-image',
  templateUrl: './full-image.component.html',
  styleUrls: ['./full-image.component.scss'],
})
export class FullImageComponent implements OnInit {
  url
  constructor(
    public modalController: ModalController,
    public navParams: NavParams
  ) {
    this.url = navParams.get("url")
  }

  closeImage(){
    this.modalController.dismiss()
  }

  ngOnInit() {}

}
