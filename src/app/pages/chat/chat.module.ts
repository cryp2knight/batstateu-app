import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import {TimeAgoModule} from 'src/app/modules/time-ago/time-ago.module'

import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    TimeAgoModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
