import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IabPage } from './iab';

@NgModule({
  declarations: [
    IabPage,
  ],
  imports: [
    IonicPageModule.forChild(IabPage),
  ],
})
export class IabPageModule {}
