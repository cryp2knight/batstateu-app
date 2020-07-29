import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';

import {TimeAgoModule} from 'src/app/modules/time-ago/time-ago.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
    TimeAgoModule
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
