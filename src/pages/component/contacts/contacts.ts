import { Component, Pipe } from '@angular/core';  
import { NavController, AlertController, LoadingController } from 'ionic-angular';  
import { pinyin } from './pinyin';  
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';  
import { Contacts, Contact, ContactField, ContactFindOptions, ContactFieldType } from '@ionic-native/contacts';
import { Device }   from '@ionic-native/device'
 

@Component({  
  selector: 'page-contacts',  
  templateUrl: 'contacts.html',  
  
})  
export class ContactPages {  
  location: Location;  
  searchInput: string;  
  
  formatContacts: any = [];  //按首字母顺序格式化后的数组  
  allSearchContacts = [];  //未排序供搜索的数组  
  searchingItems = []; //搜索显示的数组  
  loader;  
  
  searchQuery: string = '';  
  items: string[];  
  isSearching = false;  
  
  constructor(public navCtrl: NavController, 
    location: Location, 
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController,
    public device: Device,
    public contacts: Contacts) {  
  
    // this.location = location;  
    this.searchInput = "";  
    console.log('constructor+ContactPage');  
  
  
    this.presentLoading();  
    this.getAllContacts();  
      
  
  
  }  
  initializeItems() {  
    this.searchingItems = this.allSearchContacts;  
  }  
  
  getItems(ev: any) {  
    console.log('getItems');  
    this.isSearching = true;  
    this.initializeItems();  
  
    let val = ev.target.value;  
    if (val && val.trim() != '') {  
      this.searchingItems = this.searchingItems.filter((item) => {  
        // console.log('filteritem==' + JSON.stringify(item));  
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);  
      })  
    } else {  
      this.isSearching = false;  
  
    }  
  }  
  onCancelSearch(event) {  
    this.isSearching = false;  
    this.searchingItems = [];  
  }  
  presentLoading() {  
    this.loader = this.loadingCtrl.create({  
      content: "正在读取通讯录...",  
    });  
    this.loader.present();  
  }  
  goWhere(loc) {  
    console.log('loc==' + loc);  
    this.location.go(loc);  
    // $location.hash(loc);  
    // $anchorScroll();  
  }  
  
  searchByKeyword(event) {  
    console.log('input value=' + this.searchInput);  
    let camel = pinyin.getCamelChars(this.searchInput).substring(0, 1);  
    console.log("camel==" + camel);  
    this.goWhere('contact-' + camel);  
    console.log('contacts objs sort==' + JSON.stringify(this.formatContacts));  
  }  
  
  
  
  calling(item) {  
    let alert = this.alertCtrl.create({  
      title: '呼叫  ' + item.displayName,  
      subTitle: item.phoneNumber,  
      buttons: [  
        {  
          text: '确定',  
          handler: () => {  
          }  
        }  
      ]  
    })  
    alert.present();  
  }  
  
  
  /* 
  * 获取联系人 
  */  
  getAllContacts() {  
    console.log('getAllContacts');  
  
    if (this.formatContacts.length === 0) {  
      let options = new ContactFindOptions();  
      let fields: ContactFieldType[];  
      fields = ["displayName", "phoneNumbers"];  
      options.filter = "";  
      options.multiple = true;  
      options.hasPhoneNumber = true;  
      this.contacts.find(fields, options).then((result) => {  
        this.onSuccess(result, this);  
      });  
    }  
  
  
  
  
  
  }  
  
  
  //读取通讯录成功  
  onSuccess = function (contacts, context) {  
    console.log("getAllContacts onSuccess");  
    // console.log('Found contacts length==' + contacts.length);  
    // console.log('all contacts==' + JSON.stringify(contacts));  
    let contactsLength = contacts.length;  
  
    //显示的名称，Android ios不同  
    let isAndroid = true;  
    if (this.platform != 'Android') {  
      console.log('is IOS');  
      isAndroid = false;  
    }  
  
    for (let i = 0; i < contactsLength; i++) {  
      // console.log('obj for ' + JSON.stringify(contacts[i]));  
      if (contacts[i]._objectInstance.phoneNumbers == null) {  
        // console.log('非正常联系人信息 电话为空！==' + JSON.stringify(contacts[i]));  
        continue;  
      }  
      let obj = {  
        displayName: '',  
        phoneNumber: '',  
        pinyinName: ''  
      };  
  
      if (isAndroid) {  
        if (contacts[i]._objectInstance.displayName != null) {  
          obj.displayName = contacts[i]._objectInstance.displayName;  
        } else if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {  
          obj.displayName = contacts[i]._objectInstance.name.formatted;  
        }  
      } else {  
        //ios 取一个不为空的name  
        // if (contacts[i]._objectInstance.name.formatted != null) {  
        //   obj.displayName = contacts[i]._objectInstance.name.formatted;  
        // } else if (contacts[i]._objectInstance.name.familyName != null) {  
        //   obj.displayName = contacts[i]._objectInstance.name.familyName;  
        // } else {  
        //   obj.displayName = contacts[i]._objectInstance.name.givenName;  
        // }  
        if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {  
          obj.displayName = contacts[i]._objectInstance.name.formatted;  
        }  
      }  
  
      //去掉名称非汉字，英文的        
      let reg = /^[A-Za-z]+$/;  
      //名字为空或非字母，加到最后一组  
      obj.phoneNumber = contacts[i]._objectInstance.phoneNumbers[0].value;  
      //有名字  
      // console.log('one contact==' + i + '  ' + JSON.stringify(obj));  
      obj.pinyinName = pinyin.getFullChars(obj.displayName);  
      // console.log('one contact getFullChars ' + i);  
  
      if (!reg.test(obj.pinyinName) || obj.displayName == '') {  
        // console.log('非正常联系人信息 名字不对==' + JSON.stringify(obj));  
  
        let len = this.formatContacts.length;  
        for (let j = 0; j < len; j++) {  
          // console.log("ffff");  
          if ((this.formatContacts[j] as any).key == 'Z') {  
            (this.formatContacts[j] as any).value.push(obj);  
            break;  
          }  
        }  
      } else {  
        //不排序，供搜索使用的数组  
        this.allSearchContacts.push(obj);  
        let camelChar = pinyin.getCamelChars(obj.displayName).substring(0, 1);  
        if (reg.test(camelChar)) {  
          let j = 0;  
          let len = this.formatContacts.length;  
          for (j; j < len; j++) {  
            // console.log("ffff");  
            if ((this.formatContacts[j] as any).key == camelChar) {  
              (this.formatContacts[j] as any).value.push(obj);  
              break;  
            }  
          }  
          if (j == len) {  
            // console.log('新增key');  
            let arr = new Array();  
            arr.push(obj);  
            this.formatContacts[len] = {  
              key: camelChar,  
              value: arr  
            };  
          }  
        }  
      }  
      // console.log('obj format==' + JSON.stringify(obj));  
      obj = null;  
    }  
  
    this.formatContacts = this.sortContacts(this.formatContacts);  
    context.loader.dismiss();  
   
    console.log('this.allSearchContacts==' + this.allSearchContacts.length);  
    // localStorage.setItem('local_contacts', this.formatContacts.toString());  
    // console.log('contacts objs format==' + JSON.stringify(CallProvider.formatContacts));  
  
  }  
  
  
  sortContacts(formatContacts) {  
    // let arr = [{ key: 'S', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }  
    //   , { key: 'Z', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }  
    //   , { key: 'N', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }  
    //   , { key: 'D', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }  
    //   , { key: 'B', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }  
    //   , { key: 'A', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }];  
  
    //首字母排序  
    formatContacts.sort(function (a, b) {  
      if (a.key < b.key) {  
        return -1;  
      } else if (a.key > b.key) {  
        return 1;  
      } else {  
        return 0;  
      }  
    });  
  
    //每组内部排序  
    for (let i = 0; i < formatContacts.length; i++) {  
      formatContacts[i].value.sort(function (a, b) {  
        if (a.key < b.key) {  
          return -1;  
        } else if (a.key > b.key) {  
          return 1;  
        } else {  
          return 0;  
        }  
      });  
    }  
    return formatContacts;  
  
  }  
  
  
} 
