import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events, IonicApp, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { FirstRunPage ,LoginPage} from '../pages';
import { Settings } from '../providers'; 
import { MainPage } from '../pages/index'


import { JmessageServiceProvider } from '../providers/jmessage-service/jmessage-service';
@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: string = MainPage;

  
 
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(private translate: TranslateService, 
    platform: Platform, 
    settings: Settings, 
    private config: Config, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    public Jmessage: JmessageServiceProvider, 
    public storage: Storage,
    public events:Events,
    public ionicApp: IonicApp,
    public modalCtrl:ModalController,
    public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    

       
        this.Jmessage.init();//
      

       // 订阅重新登录事件
       this.events.subscribe('user:reLogin', () => {
        //用于判断登录页面是否已经显示
        let isLoginShow = false;
        let activePortal = this.ionicApp._modalPortal.getActive();
        if (activePortal) {
          let instance = activePortal.instance;
          if(instance.constructor.name == LoginPage){
            isLoginShow = true;
          };
        }
        if(!isLoginShow){
          this.modalCtrl.create(LoginPage).present();
        }
      });

      this.events.subscribe('contact-notify',(params) =>{
        alert("subscribe contact-notify :" + JSON.stringify(params))

        // if(params.result.type == "invite_received"){
        //   this.invite_received(params.result);
        // }
        if(params){
          switch(params.result.type){
            case 'invite_received':this.invite_received(params.result);
            break;

            case 'invite_accepted':this.invite_accepted(params.result); 
            break;

            case 'invite_declined':this.invite_declined(params.result); 
            break;

            case 'contact_deleted':this.contact_deleted(params.result); 
            break;

            default:
          }
        }
      })

      this.events.subscribe('open-notice',(result)=>{
        this.nav.push('ConversationPage',{
          username:result.from.username,
          serverMessageId:result.serverMessageId
        })
      });


      //接收到消息时，判断页面是否在聊天页面，若不是，则跳转到聊天界面
      this.events.subscribe('receive-message',(res)=>{
    
        const tabs = this.nav.getActiveChildNav();
        const tab = tabs.getSelected();
        const activeVC = tab.getActive();

       // alert("(activeVC.name:"+activeVC.name)
        if(activeVC.name == "ConversationPage"){ 
          this.events.publish('receive-message-fromRoot',res);
        }else{
          this.events.publish('jmessage.notificationReceived')
        }
      })
    
      this.initBMap();
    });

     

    this.initTranslate();

    // this.storage.get('isFirstStart').then((val)=>{
    //   if(val){
    //     this.rootPage = LoginPage;
    //   }else{
    //     this.rootPage = FirstRunPage;
    //   }
    // });
  
  }

  //初始化语言
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    this.translate.addLangs(["zh-cmn-Hans", "en","zh-cmn-Hant"]);
    this.storage.get("language").then((lang)=>{
      if(lang){
        this.translate.use(lang);
      }else{
        const browserLang = this.translate.getBrowserLang();

        if (browserLang) {
          if (browserLang === 'zh') {
            const browserCultureLang = this.translate.getBrowserCultureLang();
    
            if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
              this.translate.use('zh-cmn-Hans');
            } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
              this.translate.use('zh-cmn-Hant');
            }
          } else {
            this.translate.use(this.translate.getBrowserLang());
          }
        } else {
          this.translate.use('en'); // Set your language here
        }
      }
    });
   
   

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  //初始化开始页面
  initPage(){
    this.storage.get('account').then((result)=>{
      if(result && result.username && result.password){
        // alert("get storage:" + JSON.stringify(result))

        try{
          this.Jmessage.login(result).then((result)=>{
            this.nav.setRoot(this.rootPage);
          }) ;;
        }catch(e){
          console.log(e)
        }
        
      }else{
        this.events.publish('user:reLogin') 
      }
    }) 
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  invite_received(params) {
    // alert("open alertCtrl")
    const prompt = this.alertCtrl.create({
      title: '好友邀请',
      message: params.fromUsername + "想加您为好友",
      inputs: [
        {
          name: 'reason',
          placeholder: 'reason'
        },
      ],
      buttons: [
        {
          text: 'refuse',
          handler: data => {
             this.Jmessage.declineInvitation(params.fromUsername,"j拒绝")
             .then((result)=>{
              alert("declineInvitation:" + JSON.stringify(result));
              
            }).catch((error)=>{
              alert("declineInvitation error:"+JSON.stringify(error));
            }) 
          }
        },
        {
          text: 'agree',
          handler: data => { 

            this.Jmessage.acceptInvitation(params.fromUsername)
            .then((result)=>{
             alert("acceptInvitation:" + JSON.stringify(result));
             this.events.publish('friend-accpet',result);

             this.Jmessage.createConversationSingle(params.fromUsername).then(()=>{
              this.Jmessage.sendTextMessageSingle(params.fromUsername,params.fromUsername+"已经通过你的好友验证。");
             })
           }).catch((error)=>{
             alert("acceptInvitation error:"+JSON.stringify(error));
           }) 
          }
        }
      ]
    });
    prompt.present();
  }

  invite_accepted(params){
    alert(JSON.stringify(params))
  }
    
  invite_declined(params){

  }
     
  contact_deleted(params){

  }

  initBMap(){
    console.log("MyApp::constructor platform.ready");
    baidumap_location.getCurrentPosition( (result) => {
      alert(JSON.stringify(result, null, 4))
      console.log("================")
      console.log(JSON.stringify(result, null, 4));
    },   (error)=> {

    });
  }
}
