
import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import { JPush } from '@jiguang-ionic/jpush';
import {IS_DEBUG} from "./constants";
import {NativeService} from "../services/native-service";
import { Session} from "../services/session";
/**
 * 极光推送
 */
@Injectable()
export class JPushService {

  constructor(private jPush: JPush,
              private nativeService: NativeService,
              private events: Events,
              private session: Session) {
  }

  initJpush() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.init();
    this.jPush.setDebugMode(IS_DEBUG);
    this.getDeviceId();
    this.jPushAddEventListener();
  }

  private jPushAddEventListener() {
    this.jPush.getUserNotificationSettings().then(result => {
      if (result == 0) {
        console.log('jpush-系统设置中已关闭应用推送');
      } else if (result > 0) {
        console.log('jpush-系统设置中打开了应用推送');
      }
    });
    //点击通知进入应用程序时会触发的事件
    document.addEventListener("jpush.openNotification", event => {
      //this.setIosIconBadgeNumber(0);
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.openNotification" + content);
      this.events.publish('jpush.openNotification', content);
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      //let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      
      let extras = this.nativeService.isIos() ? event['aps'].extras : event['extras']['cn.jpush.android.EXTRA'];
      
      console.log("jpush.receiveNotification" + JSON.stringify(extras));
      //this.nativeService.alert(JSON.stringify(extras));
      this.events.publish('jpush.receiveNotification', extras);
    }, false);

    // //收到自定义消息时触发这个事件
    // document.addEventListener("jpush.receiveMessage", event => {
    //   let message = this.nativeService.isIos() ? event['content'] : event['message'];
    //   console.log("jpush.receiveMessage" + message);
    // }, false);

  }

  setAlias() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.setAlias({sequence: 1, alias: this.session.userId.toString()}).then((result) => {
      console.log('jpush-设置别名成功:');
      console.log(result);
    }, (error) => {
      console.log('jpush-设置别名失败:' + error.code);
    });
  }

  deleteAlias() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.deleteAlias({sequence: 2}).then((result) => {
      console.log('jpush-删除别名成功');
      console.log(result);
    }, (error) => {
      console.log('jpush-设删除别名失败:' + error.code);
    });
  }

  setTags(tags: Array<string> = []) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    if (this.nativeService.isAndroid()) {
      tags.push('android');
    }
    if (this.nativeService.isIos()) {
      tags.push('ios');
    }
    this.jPush.setTags({sequence: 3, tags: tags}).then((result) => {
      console.log('jpush-设置标签成功');
      console.log(result);
    }, (error) => {
      console.log('jpush-设置标签失败:' + error.code);
    })
  }

  deleteTags(tags: Array<string> = []) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.deleteTags({sequence: 4, tags: tags}).then((result) => {
      console.log('jpush-删除标签成功');
      console.log(result);
    }, (error) => {
      console.log('jpush-删除标签失败:' + error.code);
    })
  }

  //设置ios应用角标数量
  setIosIconBadgeNumber(badgeNumber) {
    if (this.nativeService.isIos()) {
      this.jPush.setBadge(badgeNumber);//上传badge值到jPush服务器
      this.jPush.setApplicationIconBadgeNumber(badgeNumber);//设置应用badge值
    }
  }
  //取得设备Id
  getDeviceId() {  
    this.jPush.getRegistrationID().then((deviceId)=>{
      this.session.deviceId = deviceId;
    });
    // .then(res => {
    //     this.nativeService.alert(res);
    //     console.log('jpush-RegistrationID:' + res);
    // });  
  }  

}
