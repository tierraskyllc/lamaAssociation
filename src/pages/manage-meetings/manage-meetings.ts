import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'

/**
 * Generated class for the ManageMeetingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-meetings',
  templateUrl: 'manage-meetings.html',
})
export class ManageMeetingsPage {

  loading: Loading;
  items: any;
  data: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController) {
      this.items = [];
  }

  ionViewWillLoad() {
    this.getMeetings();
  }

  public ionViewWillEnter() {
    this.getMeetings();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageMeetingsPage');
  }

  private addMeeting() {
    this.navCtrl.push("AddmeetingPage");
  }

  getMeetings() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "meetings/getmeetings.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              var d = new Date(decoded_response[2][i]["start_dttm"].replace(/-/g,'/'));
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              decoded_response[2][i]["start_dttm"] = d.getMonth()+1 + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + strTime;
              //decoded_response[2][i]["start_dttm"] = decoded_response[2][i]["start_dttm"].substring(5,7) + '-' + decoded_response[2][i]["start_dttm"].substring(8,10) + '-' + decoded_response[2][i]["start_dttm"].substring(0,4);
            }
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Meetings-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Meetings-002");
          this.loading.dismissAll();
        }
      );
  }

  openMeeting(lama_meetings_id: number) {
    this.navCtrl.push("ViewupdatemeetingPage", { lama_meetings_id: lama_meetings_id });
  }

  openSignIn(lama_meetings_id: number) {
    this.navCtrl.push("SignintomeetingPage", { lama_meetings_id: lama_meetings_id });
  }

  openMeetingAttendees(lama_meetings_id: number) {
    console.log('openMeetingAttendees clicked');
    this.navCtrl.push("MeetingattendeesPage", { lama_meetings_id: lama_meetings_id });
  }

}
