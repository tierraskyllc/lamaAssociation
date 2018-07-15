import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'

/**
 * Generated class for the ManageApplicationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-applications',
  templateUrl: 'manage-applications.html',
})
export class ManageApplicationsPage {

  loading: Loading;

  data: any = {};

  searchTerm: string = '';
  searchTimer: any;
  items: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController
  ) {
    this.data.pendingapptitle = "Pending Applications:"
    this.items = [
      //[1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted']
    ];
  }

  ionViewWillLoad() {
    this.getPendingApplications();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageApplicationsPage');
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.searchApplications();
      },1500);
  }

  getPendingApplications() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "application/listpendingapplications.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              decoded_response[2][i]["dttmcreated"] = decoded_response[2][i]["dttmcreated"].substring(5,7) + '-' + decoded_response[2][i]["dttmcreated"].substring(8,10) + '-' + decoded_response[2][i]["dttmcreated"].substring(0,4);
            }
            this.items = decoded_response[2];
            if(this.items.length > 0) {
              this.data.pendingapptitle = "Pending Applications"
            }
            else {
              this.data.pendingapptitle = "NO Pending Applications"
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
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.loading.dismissAll();
        }
      );
  }

  searchApplications() {
    console.log(this.searchTerm);
  }

}
