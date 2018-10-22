import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";

/**
 * Generated class for the ManagegaragesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-managegarages',
  templateUrl: 'managegarages.html',
})
export class ManagegaragesPage {

  loading: Loading;
  data: any = {};
  searchTerm: string = '';
  searchTimer: any;
  items: any;
  searcheditems: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController) {
      this.data.searchgarageflag = false;
      this.data.searchgaragetitle = "";
      this.items = [];
      this.searcheditems = [];
  }

  ionViewWillLoad() {
    //this.getGarages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageGaragesPage');
  }

  public ionViewWillEnter() {
    this.getGarages();
    //this.searchGarages();
  }

  getGarages() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "garage/listgarages.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Garages-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Garages-002");
          this.loading.dismissAll();
        }
      );
  }

  searchGarages() {
    this.data.searchgarageflag = true;
    this.searcheditems = [];
    if(this.searchTerm == "") {
      this.data.searchgarageflag = false;
      this.data.searchgaragetitle = "";
      return;
    }
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('search_text', this.searchTerm);
    this.http
      .post(this.shareProvider.server + "garage/searchgarages.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.searcheditems = decoded_response[2];
            if(this.searcheditems.length <= 0) {
              this.data.searchgaragetitle = "No members found with search term: " + this.searchTerm;
            }
            else {
              this.data.searchgaragetitle = "Members for search term: " + this.searchTerm;
            }
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Garages-003");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Garages-004");
          this.loading.dismissAll();
        }
      );
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.searchGarages();
      },1000);
  }

  openGarage(lama_members_id, username) {
    this.navCtrl.push("ManagegaragePage", { lama_members_id: lama_members_id, username: username });
  }

}

