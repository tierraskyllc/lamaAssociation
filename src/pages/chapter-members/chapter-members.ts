import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";

/**
 * Generated class for the ChapterMembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chapter-members',
  templateUrl: 'chapter-members.html',
})
export class ChapterMembersPage {

  loading: Loading;
  data: any = {};
  items: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              private shareProvider: ShareProvider,
              public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.getChapterMembers();
    console.log('ionViewDidLoad ChapterMembersPage');
  }

  getChapterMembers() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "members/chaptermembers.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.items = decoded_response[2];
            this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push("LoginPage", { data: 'Please login again.' });
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
              console.log("Unknown problem occured.  Please contact administrator.  Code: Chapter-Members-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Chapter-Members-002");
          this.loading.dismissAll();
        }
      );
  }

}
