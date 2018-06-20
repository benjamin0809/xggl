import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPages } from './contacts';

@NgModule({
  declarations: [
    ContactPages,
  ],
  imports: [
    IonicPageModule.forChild(ContactPages),
  ],
})
export class ContactsPageModule {}
