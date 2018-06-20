import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';

/**
 * Generated class for the JpushPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jpush',
  templateUrl: 'jpush.html',
})
export class JpushPage {

  public registrationId: string;//注册id

  devicePlatform: string;   //设备平台
  sequence: number = 0;

  aliasResultHandler = function(result) {
    var sequence: number = result.sequence;
    var alias: string = result.alias;
    alert('Success!' + '\nSequence: ' + sequence + '\nAlias: ' + alias);
  };

  errorHandler = function(err) {
    var sequence: number = err.sequence;
    var code = err.code;
    alert('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  };
  tagResultHandler = function(result) {
    var sequence: number = result.sequence;
    var tags: Array<string> = result.tags == null ? [] : result.tags;
    alert('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public jpush: JPush, 
    device: Device) {

      this.devicePlatform = device.platform;

      //接收通知
      document.addEventListener('jpush.receiveNotification', (event: any) => {
        let content;
        if (this.devicePlatform == 'Android') {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        alert('Receive notification: ' + JSON.stringify(event));
      }, false);

      //android打开通知事件
      document.addEventListener('jpush.openNotification', (event: any) => {
        let content;
        if (this.devicePlatform == 'Android') {
          content = event.alert;
        } else {  // iOS
          if (event.aps == undefined) { // 本地通知
            content = event.content;
          } else {  // APNS
            content = event.aps.alert;
          }
        }
        alert('open notification: ' + JSON.stringify(event));
      }, false);

      document.addEventListener('jpush.receiveLocalNotification', (event: any) => {
        // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
        let content;
        if (this.devicePlatform == 'Android') {
        } else {
          content = event.content;
        }
        alert('receive local notification: ' + JSON.stringify(event));
      }, false);
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad JpushPage');
  }

  //获取注册id
  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
      });
  }

  //设置标签
  setTags() {
    this.jpush.setTags({ sequence: this.sequence++, tags: ['Tag1', 'Tag2']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  //增加标签
  addTags() {
    this.jpush.addTags({ sequence: this.sequence++, tags: ['Tag3', 'Tag4']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  //检查标签绑定状态
  checkTagBindState() {
    this.jpush.checkTagBindState({ sequence: this.sequence++, tag: 'Tag1' })
      .then(result => {
        var sequence = result.sequence;
        var tag = result.tag;
        var isBind = result.isBind;
        alert('Sequence: ' + sequence + '\nTag: ' + tag + '\nIsBind: ' + isBind);
      }).catch(this.errorHandler);
  }

  //删除标签
  deleteTags() {
    this.jpush.deleteTags({ sequence: this.sequence++, tags: ['Tag4']})
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  //获取所有标签
  getAllTags() {
    this.jpush.getAllTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  //清除标签
  cleanTags() {
    this.jpush.cleanTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }
  setAlias() {
    this.jpush.setAlias({ sequence: this.sequence++, alias: 'TestAlias' })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  getAlias() {
    this.jpush.getAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  deleteAlias() {
    this.jpush.deleteAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  addLocalNotification() {
    if (this.devicePlatform == 'Android') {
      this.jpush.addLocalNotification(0, 'Hello JPush', 'JPush', 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, 'Hello JPush', 1, 'localNoti1');
    }
  }
}
