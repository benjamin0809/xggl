import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";
import { TranslateService } from '@ngx-translate/core';
import { HttpService, Session, StorageService, Utility, NativeService } from '../services/services';
import { UserProvider } from './user-provider';

@Injectable()
export class AuthProvider {

  constructor(private httpService: HttpService, 
    private storageService: StorageService, 
    private userProvider: UserProvider,
    private events:Events,
    private nativeService:NativeService,
    private translate: TranslateService,
    private session: Session) { 

  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    accountInfo.password = Utility.md5(accountInfo.password);
    let seq = this.httpService.post('Auth/Login', false, accountInfo).share();
    seq.subscribe((data: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (data.errcode == 0) {
        this._loginSuccessHandle(data);
      } else {
        throw Error(data.errmsg);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.httpService.post('Auth/Register', false, {
      "mobilePhone":accountInfo.country+" " + accountInfo.mobilephone,
      "securityCode":accountInfo.verifyCode
    }).share();

    seq.subscribe((data: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (data.errcode == 0) {
          this._loginSuccessHandle(data);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  /*
    短信校验登录
  */
  onteLogin(accountInfo: any) {
    let seq = this.httpService.post('Auth/LoginBySecurityCode', false, {
      "mobilePhone":accountInfo.country+" " + accountInfo.mobilephone,
      "securityCode":accountInfo.verifyCode
    }).share();

    seq.subscribe((data: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (data.errcode == 0) {
          this._loginSuccessHandle(data);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  /**
   * 登录成功处理
   */
  _loginSuccessHandle(data) {
    //Utility.sessionStorageClear();//清除数据缓存
    this.session.userId = data.result.userId;
    this.session.token = data.result.userToken;
    if(this.session.userId==null || this.session.userId==undefined) this.session.userId = data.result.userid;
    if(this.session.token==null || this.session.token==undefined) this.session.token = data.result.usertoken;
    this.storageService.setItem('token', this.session.token);
    this.storageService.getItem('enabled-file-cache-' + this.session.userId).then(res => {//获取是否启用缓存文件
      if (res === false) {
        this.session.enabledFileCache = false;
      }
    });
    // this.loadAvatarPath(userInfo.avatarId).subscribe(avatarPath => {//加载用户头像
    //   userInfo.avatarPath = avatarPath;
    //   this.session.user.avatarPath = avatarPath;
    // });
    //this.helper.setTags();
    //this.helper.setAlias();
    this.events.publish('user:logined', {"userId":this.session.userId,"userToken":this.session.token});

    // this.userProvider.getUserInfo().subscribe((data: any) => {
    //   //this.session.user = data.result;
    // });

    //更新用户设备Id
    //this.nativeService.showToast(this.session.deviceId);
    if(this.session.deviceId!=null){
      //this.nativeService.alert(this.session.deviceId);
      this.userProvider.updateDeviceId(this.session.deviceId);
    }
    
  }

  refreshUserToken(){
    let seq = this.httpService.get('Auth/RefreshUserToken', true, {}).share();
    seq.subscribe((data: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (data.errcode == 0) {
          this._loginSuccessHandle(data);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  sendSecurityCode(accountInfo: any){
    let seq = this.httpService.post('Auth/SendSecurityCode', true, {"mobilePhone":accountInfo.country+" " + accountInfo.mobilephone}).share();
    seq.subscribe((data: any) => {
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("SIGNUP_VERIFYCODE_ISSENT"));
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  setPassword(input:any){
    //let seq = this.httpService.get('User/setPassword', true, input).share();

    let seq = this.httpService.post('User/setPassword', true, {
      "password": Utility.md5(input.password.toString())
    }).share();

    // seq.subscribe((data: any) => {
    //   this.session.user = data.result;
    // });Password

    seq.subscribe((data: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("SET_PASSWORD_ISSENT"));
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  getAuthCode(){
    let seq = this.httpService.get('Auth/GetCode', true, {}).share();
    return seq;
  }
}
