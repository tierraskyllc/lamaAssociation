import { Component } from "@angular/core";
import { NavController, IonicPage, ModalController } from "ionic-angular";
import { ToastService } from "../../services/toast.service";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  following = false;
  signingIn = false;
  underConstruction = true;
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
    memberSince: 2003
  };

  posts = [
    {
      postImageUrl: "assets/images/background/background-2.jpg",
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that happy girls are the prettiest girls.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: "November 5, 2016",
      likes: 12,
      comments: 4,
      timestamp: "11h ago"
    },
    {
      postImageUrl: "assets/images/background/background-3.jpg",
      text:
        "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      date: "October 23, 2016",
      likes: 30,
      comments: 64,
      timestamp: "30d ago"
    }
  ];

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public modalCtrl: ModalController,
  ) { }

  openQrCodeModal() {
    this.openModal('QrCodeModalPage');
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, null, { cssClass: 'inset-modal' })
                  .present();
  }

  ionViewDidLoad() {
    console.log("Hello ProfileFour Page");
  }

  signIn() {
    this.signingIn = !this.signingIn;
    this.toastCtrl.create("Signing In member clicked");
  }

  follow() {
    this.following = !this.following;
    this.toastCtrl.create("Follow member clicked");
  }

  imageTapped(post) {
    this.toastCtrl.create("Post image clicked");
  }

  comment(post) {
    this.toastCtrl.create("Comments clicked");
  }

  like(post) {
    this.toastCtrl.create("Like clicked");
  }
}
