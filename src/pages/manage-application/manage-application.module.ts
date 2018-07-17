import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageApplicationPage } from './manage-application';

@NgModule({
  declarations: [
    ManageApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageApplicationPage),
    TextMaskModule
  ],
})
export class ManageApplicationPageModule {}
