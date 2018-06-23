import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
 
import { UserProvider } from '../../providers/providers';
import { Storage } from '@ionic/storage';


import { JmessageServiceProvider } from '../../providers/jmessage-service/jmessage-service';
import { NativeService } from '../../services/native-service';

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
    public storage: Storage,
    public Jmessage: JmessageServiceProvider,
    public events:Events,
    public nativeService: NativeService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.events.subscribe('user-login',()=>{
      this.navCtrl.setRoot(MainPage);
    });

    this.storage.get("accItem").then((val) =>{
      if(val){
        this.account.account = val.account;
        this.account.pwd = val.pwd;
      }
      
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    if(!this.account.account){
      alert("用户名不能为空")
      return;
    }
    if(!this.account.pwd){
      alert("密码不能为空")
      return;
    }

    this.userProvider.getUserInfo(this.account).subscribe((resp) => {
      console.log(resp)

      this.storage.set('accItem',this.account);
      if(resp.data.result){

        if(this.nativeService.isMobile()){

          this.Jmessage.login(this.account);
        }else{

          this.navCtrl.setRoot(MainPage);
        }
 
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

  //仅限极光IM登录
  signIn(){
    if(!this.account.account){
      alert("用户名不能为空")
      return;
    }
    if(!this.account.pwd){
      alert("密码不能为空")
      return;
    }

    this.Jmessage.login(this.account);
  }
  
}
