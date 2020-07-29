import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthConstants } from 'src/app/config/auth-constants';
import { ToastService } from 'src/app/services/toast.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  postData = {
    auth_user: '',
    auth_password: '',
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastServie: ToastService
  ) { }

  ngOnInit() { }

  saveUserToFirebase(data) {
    data.firebaseToken = null
    let ref = firebase.database().ref('users/' + data.usr_name + '/')
    ref.update(data, (error) => {
      if (error) {
        console.log(error.message)
      }
    })
    data.token = null
    firebase.database().ref('/messages/users/'+data.usr_name+'/')
    .update(data)
  }

  validateInputs() {
    let auth_user = this.postData.auth_user.trim();
    let auth_password = this.postData.auth_password.trim();
    return (
      this.postData.auth_user &&
      this.postData.auth_password &&
      auth_user.length > 0 &&
      auth_password.length > 0
    );
  }

  loginAction() {
    if (this.validateInputs()) {
      this.authService.login(this.postData).subscribe(
        (res: any) => {
          if (res) {
            console.log(res)
            firebase.auth().signInWithCustomToken(res.firebaseToken).then(() => {
              this.saveUserToFirebase(res)
              this.storageService.store(AuthConstants.AUTH, res);
              this.router.navigate(['home/feed']);
            })
          } else {
            this.toastServie.presentToast('Login Failed')
            console.log('incorrect password')
          }
        },
        (error: any) => {
          this.toastServie.presentToast('Login Failed')
          console.log('Login Failed');
        }
      )
    } else {
      this.toastServie.presentToast("Please enter username or password")
      console.log("Please enter username or password")
    }
  }


}
