import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

/**
 * Generated class for the FilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-file',
  templateUrl: 'file.html',
})
export class FilePage {

  resArray: any[];

  result: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public file: File
  ) {
    this.resArray = [
      {fullname:'applicationDirectory',method:'applicationDirectory'},
      {fullname:'applicationStorageDirectory',method:'applicationStorageDirectory'},
      {fullname:'dataDirectory',method:'dataDirectory'},
      {fullname:'cacheDirectory',method:'cacheDirectory'}
      ,
      {fullname:'externalApplicationStorageDirectory',method:'externalApplicationStorageDirectory'}
      ,
      {fullname:'externalDataDirectory',method:'externalDataDirectory'}
      ,
      {fullname:'externalCacheDirectory',method:'externalCacheDirectory'}
      ,
      {fullname:'externalRootDirectory',method:'externalRootDirectory'}
    ]
  }

  openComponent(item){
    this[item.method](); 
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilePage');
  }

  applicationDirectory(){
    this.result = this.file.applicationDirectory;
  }

  applicationStorageDirectory(){
    this.result = this.file.applicationStorageDirectory;
  }

  dataDirectory(){
    this.result = this.file.dataDirectory;
  }

  cacheDirectory(){
    this.result = this.file.cacheDirectory;
  } 

  externalApplicationStorageDirectory(){
    this.result = this.file.externalApplicationStorageDirectory;
  }

  externalDataDirectory(){
    this.result = this.file.externalDataDirectory;
  }

  externalCacheDirectory(){
    this.result = this.file.externalCacheDirectory;
  }

  externalRootDirectory(){
    this.result = this.file.externalRootDirectory;
  }

  
}
