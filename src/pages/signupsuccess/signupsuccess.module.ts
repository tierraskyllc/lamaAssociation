import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpSuccessPage } from './signupsuccess';

@NgModule({
  declarations: [
    SignUpSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpSuccessPage),
  ],
})
export class SignUpSuccessPageModule {}
