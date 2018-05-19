import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.params.data = {
      "duration" : 10000,
      "backgroundImage" : "assets/images/background/29.jpg",
      "logo" : "assets/images/logo/lamaHandsRoundCornersLogo.png",
      "title" : "L.A.M.A. Association"
    };

    this.params.events = {
      "onRedirect": function () {
          navCtrl.pop();
      }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
