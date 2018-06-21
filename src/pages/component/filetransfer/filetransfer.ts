import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the FiletransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filetransfer',
  templateUrl: 'filetransfer.html',
})
export class FiletransferPage {

  resArray: any[];
  result: string = "init";
  fileTransfer: any;

  resulturl:string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private transfer: FileTransfer, 
    private file: File) {
     
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiletransferPage');
  }

  download(localDirectoryUrl) {
    alert(localDirectoryUrl)

    const FT: FileTransferObject = this.transfer.create();

    const url = 'https://www.popochiu.com/upload/2018-02-06/laohao.jpeg';
    

    FT.onProgress(progressEvent => {
      if (progressEvent.lengthComputable) {
        // 下载过程会一直打印，完成的时候会显示 1
        if(progressEvent.loaded / progressEvent.total == 1){
          alert("done")
        }
        // alert(progressEvent.loaded / progressEvent.total);
      } else {
    
      }
    });

    FT.download(url, localDirectoryUrl + 'laohao.jpeg').then((entry) => {
      console.log('download complete: ' + entry.toURL());

      this.resulturl =  entry.toURL();
    }, (error) => {
      // handle error
      alert("error:"+JSON.stringify(error))
    });
  }

  openComponent(item){
    this[item.method](); 
 
  }

  

  applicationDirectory(){
    this.result = this.file.applicationDirectory;
    this.download(this.result);
  }

  applicationStorageDirectory(){
    this.result = this.file.applicationStorageDirectory;
    this.download(this.result);
  }

  dataDirectory(){
    this.result = this.file.dataDirectory;
    this.download(this.result);
  }

  cacheDirectory(){
    this.result = this.file.cacheDirectory;
    this.download(this.result);
  } 

  externalApplicationStorageDirectory(){
    this.result = this.file.externalApplicationStorageDirectory;
    this.download(this.result);
  }

  externalDataDirectory(){
    this.result = this.file.externalDataDirectory;
    this.download(this.result);
  }

  externalCacheDirectory(){
    this.result = this.file.externalCacheDirectory;
    this.download(this.result);
  }

  externalRootDirectory(){
    this.result = this.file.externalRootDirectory;
    this.download(this.result);
  }

 

}
