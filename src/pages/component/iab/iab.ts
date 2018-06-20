import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the IabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iab',
  templateUrl: 'iab.html',
})
export class IabPage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IabPage');
    const browser = this.iab.create('https://ionicframework.com/');

    // browser.executeScript(...);

    // browser.insertCSS(...);
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();

  }

}
