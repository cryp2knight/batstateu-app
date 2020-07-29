import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomToolsService } from 'src/app/services/custom-tools.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('content') content: any;
  @ViewChild('chatList', { read: ElementRef }) chatList: ElementRef;

  authUser
  receiver
  chats = {}
  inputMessage: string = ''

  private mutationObserver: MutationObserver;

  constructor(
    private messageService: MessagesService,
    private auth: AuthService,
    private tools: CustomToolsService,
    private route: ActivatedRoute
  ) {

  }

  ionViewDidEnter() {
    this.content.scrollToBottom(300);
    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        this.content.scrollToBottom(300);
      });

      this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true
      });
    } catch (err) {
      console.log(err.message)
    }

  }

  handleFileInput(event) {
    let input = event.target
    if(input.files){
      let reader = new FileReader()
      reader.onload = ev => {
        this.messageService.uploadImage(input.files[0])
        .then(img => {
          this.messageService.sendMessage(this.receiver.usr_name, img, this.receiver)
        })
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  toDate(timestamp) {
    return new Date(timestamp)
  }

  ngOnInit() {

    this.auth.userData$.subscribe((res: any) => {
      this.authUser = res
      this.messageService = new MessagesService(this.auth)
    })
    this.route.queryParams.subscribe(resp => {
      this.messageService.getUser(resp.id).subscribe((res: any) => {
        this.receiver = res
        this.messageService.getMessages(this.receiver.usr_name).subscribe((val: any) => {
          this.chats[val.key] = val.val()
        })
      })
    })
  }

  escape = document.createElement("textarea");

  escapeHTML(html) {
    this.escape.textContent = html;
    return this.escape.innerHTML;
  }

  sendMessage(uid) {
    if (this.tools.validateInput(this.inputMessage)) {
      this.inputMessage = this.escapeHTML(this.inputMessage)
      this.messageService.sendMessage(uid, this.inputMessage, this.receiver)
      this.inputMessage = ''
    }
  }

}
