import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, ModalController } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';
import { element } from 'protractor';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  authUser
  constructor(
    private auth: AuthService,
    private navControl: NavController,
    public modalController: ModalController,
    private messageService: MessagesService
  ) { }

  chats:any = {}
  chatss = []

  ngOnInit() {
    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
      this.messageService = new MessagesService(this.auth)
      this.messageService.getChats().subscribe((sum:any)=>{
        let s = sum.snap.val()
        s.key = sum.snap.key
        this.chats[s.key] = sum.snap.val()
        if(sum.changed){
          for (let i = 0; i <= this.chatss.length; i++){
            if(this.chatss[i].key == s.key){
              this.chatss.splice(i,1)
              break
            }
          }
          this.chatss.unshift(s)
        }
        else if(sum.added){
          this.chatss.push(s)
          // sort the array here
          
        }
        
      })
    })
  }

  viewMessage(id) {
    this.navControl.navigateForward(['home/messages/chat'], {
      queryParams: {
        id: id
      }
    })
  }

  toDate(timestamp){
    return new Date(timestamp)
  }

  async addUser(ev: any) {
    const modal = await this.modalController.create({
      component: UsersListComponent,
      componentProps: {
        uid: this.authUser.usr_name,
      }
    });
    return await modal.present();
  }

}
