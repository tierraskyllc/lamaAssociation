import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";


@IonicPage()
@Component({
  selector: "page-signupsuccess",
  templateUrl: "signupsuccess.html"
})
export class SignUpSuccessPage {
  member = {
    name: "Paula Bolliger",
    profileImage: "assets/images/avatar/girl-avatar.png",
    profileQrImage: "assets/images/qr-code.png",
    coverImage: "assets/images/background/background-5.jpg",
    chapter: "L.A.M.A. Newark",
    status: "Full Pathed Member",
    title: "Road Captain",
    followers: 456,
    following: 1051,
    memberSince: 2003,
    titleHeader: "Sign Up was a Success!!",
    signUpMessageA: "Thank you for creating your account with L.A.M.A. Please",
    signUpMessageB: "after you have confirmed your email address to log into your account..",
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  loginPage() {
    //this.navCtrl.push("LoginPage");
    this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignUpSuccessPage");
  }
}
