import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageApplicationPage } from './manage-application';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    ManageApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageApplicationPage),
    TextMaskModule,
    SignaturePadModule
  ],
})
export class ManageApplicationPageModule {}
