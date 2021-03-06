import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'

/**
 * Generated class for the MeetingattendeesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetingattendees',
  templateUrl: 'meetingattendees.html',
})
export class MeetingattendeesPage {

  loading: Loading;

  data: any = {};
  items: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController) {
      this.data.lama_meetings_id = navParams.get('lama_meetings_id');
      this.data.maxid = 0;
      this.items = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingattendeesPage');
  }

  ionViewWillLoad() {
    this.getMeetingAttendees();
    this.data.intervalvar = setInterval(() => {      
      //console.log('timer');
      this.getMoreMeetingAttendees();
      },3000);
  }

  ionViewWillEnter() {
    this.getMeetingAttendees();
  }

  ionViewWillLeave() {
    clearInterval(this.data.intervalvar);
  }

  getMeetingAttendees() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_meetings_id', this.data.lama_meetings_id);
    this.http
      .post(this.shareProvider.server + "meetings/getmeetingattendees.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              var d = new Date(decoded_response[2][i]["dttm_signedin"].replace(/-/g,'/'));
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              var month = d.getMonth()+1;
              var month1 = month < 10 ? '0' + month.toString() : month.toString();
              var dt = d.getDate();
              var dt1 = dt < 10 ? '0' + dt.toString() : dt.toString();
              decoded_response[2][i]["dttm_signedin"] = month1 + '-' + dt1 + '-' + d.getFullYear() + ' ' + strTime;
              if(decoded_response[2][i]["id"] > this.data.maxid) {
                this.data.maxid = decoded_response[2][i]["id"];
              }
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: MeetingAttendees-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MeetingAttendees-002");
          this.loading.dismissAll();
        }
      );
  }

  getMoreMeetingAttendees() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_meetings_id', this.data.lama_meetings_id);
    body.append('lama_meetings_signins_id', this.data.maxid);
    this.http
      .post(this.shareProvider.server + "meetings/getmoremeetingattendees.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              var d = new Date(decoded_response[2][i]["dttm_signedin"].replace(/-/g,'/'));
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              var month = d.getMonth()+1;
              var month1 = month < 10 ? '0' + month.toString() : month.toString();
              var dt = d.getDate();
              var dt1 = dt < 10 ? '0' + dt.toString() : dt.toString();
              decoded_response[2][i]["dttm_signedin"] = month1 + '-' + dt1 + '-' + d.getFullYear() + ' ' + strTime;
              this.items.unshift(decoded_response[2][i]);
              if(decoded_response[2][i]["id"] > this.data.maxid) {
                this.data.maxid = decoded_response[2][i]["id"];
              }
            }
            //this.items = decoded_response[2];
            //this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              clearInterval(this.data.intervalvar);
              this.navCtrl.push("LoginPage", { data: 'Please login again.' });
              //this.loading.dismissAll();
            }
            else {
              clearInterval(this.data.intervalvar);
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
              console.log("Unknown problem occured.  Please contact administrator.  Code: MeetingAttendees-001");
              //this.loading.dismissAll();
            }
          }
        },
        error => {
          clearInterval(this.data.intervalvar);
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MeetingAttendees-002");
          //this.loading.dismissAll();
        }
      );
  }

}