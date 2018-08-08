import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResubmitApplicationPage } from './resubmit-application';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    ResubmitApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ResubmitApplicationPage),
    TextMaskModule
  ],
})
export class ResubmitApplicationPageModule {}
