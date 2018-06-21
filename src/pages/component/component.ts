import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ComponentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-component',
  templateUrl: 'component.html',
})
export class ComponentPage {

  message : any;
  resArray: any[] ;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.resArray = [
      {fullname:"appversion",page:"AppversionPage"},
      {fullname:"ScanPage",page:"ScanPage"},
      {fullname:"FingerprintPage",page:"FingerprintPage"},
      {fullname:"IabPage",page:"IabPage"},
      {fullname:"WechatPage",page:"WechatPage"},
      {fullname:"ContactPages",page:"ContactPages"},
      {fullname:"JpushPage",page:"JpushPage"},
      {fullname:"FilePage",page:"FilePage"},
      {fullname:"FiletransferPage",page:"FiletransferPage"},
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComponentPage');
  }

  openComponent(item){
    if(item.page){
      this.navCtrl.push(item.page);
    }
  }
}
