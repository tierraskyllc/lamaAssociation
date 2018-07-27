import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastService } from "../../services/toast.service";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'

@IonicPage()
@Component({
  selector: 'page-garage',
  templateUrl: 'garage.html',
})
export class GaragePage {

  data: any = {};

  loading: Loading;

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
    /*{
      //postImageUrl: "assets/images/background/f6b.jpg",
      year: "Year1",
      make: "Make1",
      model: "Model1",
      color: "Color1",
      total_miles: "Miles1",
      //date: "Date1",
    },
    {
      //postImageUrl: "assets/images/background/m109r.jpg",
      year: "Year2",
      make: "Make2",
      model: "Model2",
      color: "Color2",
      total_miles: "Miles2",
      //date: "Date2",
    },*/
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastService,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    //-----
    var decoded_response = null;
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "garage/garage.php", body)
      .subscribe(
        data => {
          console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.memberMotorcycleInfo = decoded_response[2];
            this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              console.log("Unknown problem occured.  Please contact administrator. - G001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          console.log("Unknown problem occured.  Please contact administrator. - G002");
          this.loading.dismissAll();
        }
      );
    //-----
    console.log('ionViewDidLoad GaragePage');
  }

  imageTapped(post) {
    this.toastCtrl.create("Post image clicked");
  }

}
