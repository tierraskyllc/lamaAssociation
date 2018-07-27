import { Component } from "@angular/core";
import { NavController, IonicPage, ModalController } from "ionic-angular";
import { ToastService } from "../../services/toast.service";
import { ActionSheetController } from 'ionic-angular'
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  loading: Loading;

  data: any = {};
  following = false;
  signingIn = false;
  underConstruction = false;
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

  posts = [
    {
      postImageUrl: "assets/images/background/background-2.jpg",
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: "November 5, 2016",
      likes: 12,
      comments: 4,
      timestamp: "11h ago"
    },
  ];

  constructor(
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController
  ) { }

  eventsPage() {
    this.navCtrl.push("EventsPage")
  }

  garagePage() {
    this.navCtrl.push("GaragePage")
  }

  openQrCodeModal() {
    this.openModal('QrCodeModalPage');
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, { qrcodevalue: this.shareProvider.username + '|' + this.shareProvider.firstname + '|' + this.shareProvider.lastname }, { cssClass: 'inset-modal' })
                  .present();
  }

  ionViewDidLoad() {
    this.loadProfileInfo();
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

  loadProfileInfo() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "profile/profile.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            if(decoded_response[2]['is_member_approved'] == 0) {
              this.navCtrl.push("ApplicationPage");
              this.loading.dismissAll();
            }
            else {
              if(decoded_response[2]['is_member_approved'] == 1) {
                this.member.name = decoded_response[2]['first_name'] + ' ' + decoded_response[2]['last_name'];
                this.member.chapter = decoded_response[2]['chapter_name'];
              }
              this.loading.dismissAll();
            }
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              console.log("Unknown problem occured.  Please contact administrator. - L001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          console.log("Unknown problem occured.  Please contact administrator. - L002");
          this.loading.dismissAll();
        }
      );
    //-----
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "profile/profileinfo.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.member.status = decoded_response[2]['type_of_membership'];
            this.member.title = decoded_response[2]['member_title'];
            this.member.memberSince = new Date(decoded_response[2]['dttmcreated']).getFullYear();
            this.member.following = decoded_response[2]['total_miles'];
            this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              console.log("Unknown problem occured.  Please contact administrator. - L001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          console.log("Unknown problem occured.  Please contact administrator. - L002");
          this.loading.dismissAll();
        }
      );
    //-----
  }

}
