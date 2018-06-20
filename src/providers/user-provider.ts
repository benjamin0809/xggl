import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";
import { HttpService } from '../services/http-service';
import { TranslateService } from '@ngx-translate/core';
import {  StorageService } from '../services/services';
import { Utility, NativeService } from '../services/services';

@Injectable()
export class UserProvider {
  constructor(private httpService: HttpService, 
    public events: Events,
    private translate: TranslateService,
    private nativeService:NativeService,
    private storageService: StorageService) { 

  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    let seq = this.httpService.get('User/Logout', true, {}).share();
    this.storageService.removeItem("userId");
    this.storageService.removeItem('token');

    // 不直接做页面跳转，发布事件，由TabsPage接收事件并处理
    this.events.publish('user:reLogin', Date.now());
    return seq;
  }

  uploadAvatar(imageData: string){
    let seq = this.httpService.post('User/UploadAvatar', true, {"imageData":imageData}).share();
    seq.subscribe((data: any) => {
      this.getUserInfo(data);
    });
    return seq;
  }

  // getUserInfo(){
  //   return this.httpService.post('User/GetUserInfo',true).map((res: Response) => res.json());
  // }
  getUserInfo(accountInfo){
    accountInfo.methodType = 'isLogin';
    let seq = this.httpService.get('', true, accountInfo).share();
    seq.subscribe((data: any) => {
      this.events.publish('user:info-changed', Date.now());
    });
    return seq;
  }

  changePassword(input:any){
    input.oldPassword = Utility.md5( input.oldPassword);
    input.newPassword = Utility.md5( input.newPassword);
    let seq = this.httpService.post('User/ResetPassword', true, input).share();
    // seq.subscribe((data: any) => {
    //   this.session.user = data.result;
    // });
    return seq;
  }

  //设置昵称
  setNickname(input:any){

    let seq = this.httpService.post('User/UpdateUserInfo', true, {
      "nickname":input.nickname
    }).share();

    seq.subscribe((data: any) => {
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("MY_SET_NICKNAME_SUCCEED"));
      }
    }, err => {
      this.nativeService.showToast(this.translate.instant("MY_SET_NICKNAME_DEFEATED"));
      console.error('ERROR', err);
    });

    return seq;
  }

    //重置电话
  setPhone(input:any){

    let seq = this.httpService.post('User/UpdateMobilePhone', true, {
      "newMobilePhone": input.phoneNo,
      "securityCode": input.securityCode
    }).share();
    seq.subscribe((data: any) => {
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("MY_SET_PHONE_SUCCEED"));
      }
    }, err => {
      this.nativeService.showToast(this.translate.instant("MY_SET_PHONE_DEFEATED"));
      console.error('ERROR', err);
    });
  
      return seq;
  }
  //绑定员工信息
  BindEmployee(input:any){
    let seq = this.httpService.post('User/BindEmployee',true,{
      "employeeNo": input.employeeNo,
      "idCardNo": input.idCardNo
    }).share();
    seq.subscribe((data: any) => {
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("MY_BIND_EMPLOYEE_SUCCEED"));
      }
    }, err => {
      this.nativeService.showToast(this.translate.instant("MY_BIND_EMPLOYEE_DEFEATED"));
      console.error('ERROR', err);
    });
      return seq;
  }
  //解除员工信息绑定
  UnbindEmployee(){
    let seq = this.httpService.get("User/UnbindEmployee",true).share();
    seq.subscribe((data: any) => {
      if (data.errcode == 0) {
        this.nativeService.showToast(this.translate.instant("MY_UNBIND_EMPLOYEE_SUCCEED"));
      }
    }, err => {
      this.nativeService.showToast(this.translate.instant("MY_UNBIND_EMPLOYEE_DEFEATED"));
      console.error('ERROR', err);
    });
      return seq;
  }

  updateDeviceId(deviceId: any){
    //this.nativeService.showToast("updateDeviceId begin");
    let seq = this.httpService.post('User/DeviceId', true, {"deviceId": deviceId }).share();
    seq.subscribe((data: any) => {
      //this.nativeService.showToast("updateDeviceId completed");
    });
    return seq;
  }

}
