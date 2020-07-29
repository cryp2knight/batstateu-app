import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadPostPageRoutingModule } from './read-post-routing.module';

import { ReadPostPage } from './read-post.page';

import {TimeAgoModule} from 'src/app/modules/time-ago/time-ago.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadPostPageRoutingModule,
    TimeAgoModule
  ],
  declarations: [ReadPostPage]
})
export class ReadPostPageModule {}
