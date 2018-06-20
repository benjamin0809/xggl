import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';  

/**
 * Generated class for the AppversionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-appversion',
  templateUrl: 'appversion.html',
})
export class AppversionPage {

  resArray: any[];
  constructor( public navCtrl: NavController, 
    public navParams: NavParams, 
    private appVersion: AppVersion) {

      this.resArray = [
        {fullname:'getPackageName',method:'getPackageName'},
        {fullname:'getAppName',method:'getAppName'},
        {fullname:'getVersionCode',method:'getVersionCode'},
        {fullname:'getVersionNumber',method:'getVersionNumber'}
      ]

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppversionPage');
  }

  getPackageName(){
    this.appVersion.getPackageName().then((val =>{
      alert(val) 
    }))
  }

  getAppName(){
    this.appVersion.getAppName().then((val =>{
      alert(val)
    }))
  }

  getVersionCode(){
    this.appVersion.getVersionCode().then((val =>{
      alert(val)
    }))
  }
 
  getVersionNumber(){
    this.appVersion.getVersionNumber().then((val =>{
      alert(val)
    }))
  }

  openComponent(item){
    this[item.method](); 
 
  }
 
}
