
import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplicationPage } from './application';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    ApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplicationPage),
    TextMaskModule,
    SignaturePadModule
  ],
})
export class ApplicationPageModule {}
