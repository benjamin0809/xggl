import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { messagePage } from './message';

@NgModule({
  declarations: [
    messagePage,
  ],
  imports: [
    IonicPageModule.forChild(messagePage),
    TranslateModule.forChild()
  ],
  exports: [
    messagePage
  ]
})
export class MessagePageModule { }
