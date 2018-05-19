import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params.data = {
      "username": "Username",
      "password": "Password",
      "register": "Register",
      "login": "Login",
      "skip": "Skip",
      "logo": "assets/images/logo/lamaHandsRoundCornersLogo.png"
  };

  this.params.events = {
    onLogin: function(params) {
       console.log("onLogin");
    },
    onRegister: function(params) {
       console.log("onRegister");
    },
    onSkip: function(params) {
       console.log("onSkip");
    },
    onFacebook: function(params) {
   console.log("onFacebook");
    },
    onTwitter: function(params) {
       console.log("onTwitter");
    },
    onGoogle: function(params) {
       console.log("onGoogle");
    },
    onPinterest: function(params) {
       console.log("onGoogle");
    },
 };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
