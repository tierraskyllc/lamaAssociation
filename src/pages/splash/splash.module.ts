import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashPage } from './splash';
import { SplashScreenLayout3Module } from '../../components/splash-screen/layout-3/splash-screen-layout-3.module';

@NgModule({
  declarations: [
    SplashPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashPage),
    SplashScreenLayout3Module

  ],
})
export class SplashPageModule {}
