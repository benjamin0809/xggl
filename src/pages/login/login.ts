import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
 
import { UserProvider } from '../../providers/providers';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { account: string, pwd: string } = {
    account: '',
    pwd: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public userProvider: UserProvider,
    public storage: Storage) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.storage.get("accItem").then((val) =>{
      if(val){
        this.account.account = val.account;
        this.account.pwd = val.pwd;
      }
      
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.userProvider.getUserInfo(this.account).subscribe((resp) => {
      console.log(resp)

      this.storage.set('accItem',this.account);
      if(resp.data.result){
        this.navCtrl.push(MainPage);
      }else{
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  goRegister(){
    this.navCtrl.push('SignupPage');
  }
}
