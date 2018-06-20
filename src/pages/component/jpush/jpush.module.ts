import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JpushPage } from './jpush';

@NgModule({
  declarations: [
    JpushPage,
  ],
  imports: [
    IonicPageModule.forChild(JpushPage),
  ],
})
export class JpushPageModule {}
