import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version'; 
import { QRScanner} from '@ionic-native/qr-scanner';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Items } from '../mocks/providers/items';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { IonicImageLoader } from 'ionic-image-loader';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { JmessageServiceProvider } from '../providers/jmessage-service/jmessage-service';
import { JMessagePlugin,JMMessageSendOptions  } from '@jiguang-ionic/jmessage'
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Http,HttpModule } from '@angular/http';
import { HttpService ,Session, Logger, NativeService,StorageService} from '../services/services';
import { CallNumber } from '@ionic-native/call-number';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { CodePush } from '@ionic-native/code-push';
import { Sim } from '@ionic-native/sim';

import { UserProvider } from '../providers/providers'  ;

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello',
    language: 'language'
  });
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: 'true' ,       //隐藏全部子页面tabs
      iconMode: 'ios',
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
  }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    QRScanner,
    AppVersion,
    InAppBrowser,
    AndroidFingerprintAuth,
    JPush,
    Device,
    UserProvider,
    HttpService, 
    Logger,
    Session,
    NativeService,
    Network,
    File,
    FileTransfer,
    AppMinimize,
    CallNumber,
    ThemeableBrowser,
    Diagnostic,
    CodePush,
    Sim,
    StorageService,
    JMessagePlugin,
    JmessageServiceProvider,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
