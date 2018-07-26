import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastService } from "../../services/toast.service";

@IonicPage()
@Component({
  selector: 'page-garage',
  templateUrl: 'garage.html',
})
export class GaragePage {

  member = {
    name: "Name from Server",
    profileImage: "assets/images/avatar/girl-avatar.png",
    profileQrImage: "assets/images/qr-code.png",
    coverImage: "assets/images/background/background-5.jpg",
    chapter: "L.A.M.A. Newark",
    status: "Full Pathed Member",
    title: "Road Captain",
    followers: 456,
    following: 1051,
    memberSince: 2003
  };

  memberMotorcycleInfo = [
    {
      postImageUrl: "assets/images/background/f6b.jpg",
      year: "Year from server",
      make: "Year from server",
      model: "Year from server",
      color: "Year from server",
      odometer: "Year from server",
      date: "Date from Server",
    },
    {
      postImageUrl: "assets/images/background/m109r.jpg",
      year: "Year from server",
      make: "Year from server",
      model: "Year from server",
      color: "Year from server",
      odometer: "Year from server",
      date: "Date from Server",
    },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastService,) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GaragePage');
  }

  imageTapped(post) {
    this.toastCtrl.create("Post image clicked");
  }

}
