import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinUsPage } from './joinus';
//import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
//import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

@NgModule({
  declarations: [
    JoinUsPage,
  ],
  imports: [
    //RecaptchaModule,
    //RecaptchaFormsModule,
    IonicPageModule.forChild(JoinUsPage),
  ],
  providers: [
    //{
      //provide: RECAPTCHA_SETTINGS,
      //useValue: {
      //  siteKey: '6Lf2eI0UAAAAAIVt21XM-2hD7VC80FCMADQz9JuA',
      //  badge: 'bottomright'
      //} as RecaptchaSettings,
    //}
  ]
})
export class JoinUsPageModule {}
