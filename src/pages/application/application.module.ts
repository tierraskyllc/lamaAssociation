import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplicationPage } from './application';

@NgModule({
  declarations: [
    ApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplicationPage),
    TextMaskModule
  ],
})
export class ApplicationPageModule {}
