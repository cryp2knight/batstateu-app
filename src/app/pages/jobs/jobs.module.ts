import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPageRoutingModule } from './jobs-routing.module';

import { JobsPage } from './jobs.page';

import {TimeAgoModule} from 'src/app/modules/time-ago/time-ago.module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobsPageRoutingModule,
    TimeAgoModule
  ],
  declarations: [JobsPage]
})
export class JobsPageModule {}
