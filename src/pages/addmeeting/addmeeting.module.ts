import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddmeetingPage } from './addmeeting';

@NgModule({
  declarations: [
    AddmeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddmeetingPage),
  ],
})
export class AddmeetingPageModule {}
