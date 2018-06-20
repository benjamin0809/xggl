import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
/**
 * Generated class for the FingerprintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fingerprint',
  templateUrl: 'fingerprint.html',
})
export class FingerprintPage {

  constructor(public navCtrl: NavController, 
    private androidFingerprintAuth: AndroidFingerprintAuth,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FingerprintPage');
  }

  testFingerPrint(){
    this.androidFingerprintAuth.isAvailable()
      .then((result)=> {
        alert(JSON.stringify(result))
        if(result.isAvailable){
          // it is available

          this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword' })
            .then(result => {
              if (result.withFingerprint) {
                  alert('Successfully encrypted credentials.');
                  alert('Encrypted credentials: ' + result.token);
              } else if (result.withBackup) {
                alert('Successfully authenticated with backup password!');
              } else alert('Didn\'t authenticate!');
            })
            .catch(error => {
              if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                alert('Fingerprint authentication cancelled');
              } else alert(error)
            });

        } else {
          // fingerprint auth isn't available
        }
      })
      .catch(error => alert(error));                                    
  }
}
