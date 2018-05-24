import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params.data = {
      "logo": "assets/images/logo/lamaHandsRoundCornersLogo.png",
      "iconAccount": "icon-account",
      "username": "Username",
      "iconHome": "icon-home-variant",
      "iconCity": "icon-city",
      "city": "City",
      "iconWeb": "icon-web",
      "country": "Country",
      "iconLock": "icon-lock",
      "password": "Password",
      "iconEmail": "icon-email-outline",
      "email": "Email",
      "submit": "submit",
      "skip": "Skip"
   };

  this.params.events = {
    onRegister: function(params) {
          console.log('onRegister');
    },
    onSkip: function(params) {
        console.log('onSkip');
    }
  };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
}
