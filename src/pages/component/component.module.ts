import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentPage } from './component';

@NgModule({
  declarations: [
    ComponentPage,
  ],
  imports: [
    IonicPageModule.forChild(ComponentPage),
  ],
})
export class ComponentPageModule {}
