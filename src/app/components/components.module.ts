import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { FullImageComponent } from './full-image/full-image.component';
import { PopoverComponent } from './popover/popover.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { EditHistoryComponent } from './edit-history/edit-history.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CreateJobComponent } from './create-job/create-job.component';


@NgModule({
  declarations: [SlidesComponent, StartButtonComponent, CreatePostComponent, FullImageComponent, PopoverComponent, EditPostComponent, EditHistoryComponent, UsersListComponent, CreateJobComponent],
  exports: [SlidesComponent, StartButtonComponent, CreatePostComponent, FullImageComponent, PopoverComponent, EditPostComponent, EditHistoryComponent, UsersListComponent, CreateJobComponent],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ComponentsModule { }
