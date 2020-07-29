import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {

  users = {}

  input:string = ''

  constructor(private modalController: ModalController,
    private messageService: MessagesService,
    public navParams: NavParams,
    public navControl: NavController
    ) {
      let usr = this.users
      this.messageService.getUsers().subscribe({
        next(user){
          usr[user.key] = user.val()
        }
      })
     }
  
  ngOnInit() {
  }


  usr = document.getElementsByClassName("user")

  handleInput(){
    let items:any = Array.from(this.usr)
    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(this.input.toLowerCase()) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    })
  }

  close(){
    this.modalController.dismiss()
  }

  viewMessage(id){
    this.navControl.navigateForward(['home/messages/chat'], {
      queryParams: {
        id: id
      }
    })
    this.close()
  }
}
