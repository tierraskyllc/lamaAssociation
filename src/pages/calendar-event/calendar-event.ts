import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the CalendarEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar-event',
  templateUrl: 'calendar-event.html',
})
export class CalendarEventPage {

  data: any = {};
  loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController,
    private http: Http
  ) {
    this.data.lama_events_id = navParams.get('lama_events_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarEventPage');
  }

  public ionViewWillEnter() {
    this.getEvent();
  }

  getEvent() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_events_id', this.data.lama_events_id);
    this.http
      .post(this.shareProvider.server + "events/geteventforcalendar.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.data.region = decoded_response[2]["region"];
            this.data.chapter_name = decoded_response[2]["chapter_name"];
            this.data.title = decoded_response[2]["title"];
            this.data.description = decoded_response[2]["description"];
            this.data.start_dttm = decoded_response[2]["start_dttm"];
            this.data.end_dttm = decoded_response[2]["end_dttm"];
            this.data.venue_country = decoded_response[2]["venue_country"];
            this.data.venue_state = decoded_response[2]["venue_state"];
            this.data.venue_city = decoded_response[2]["venue_city"];
            this.data.venue_address = decoded_response[2]["venue_address"];
            this.data.venue_zipcode = decoded_response[2]["venue_zipcode"];
            this.data.first_name_of_officer = decoded_response[2]["first_name_of_officer"];
            this.data.last_name_of_officer = decoded_response[2]["last_name_of_officer"];
            this.data.title_of_officer = decoded_response[2]["title_of_officer"];
            this.data.telephonenumber_of_officer = decoded_response[2]["telephonenumber_of_officer"];
            this.data.emailaddress_of_officer = decoded_response[2]["emailaddress_of_officer"];
            this.data.additional_info = decoded_response[2]["additional_info"];
            this.data.request_status = decoded_response[2]["request_status"];
            this.data.officer_approved_first_name = decoded_response[2]["officer_approved_first_name"];
            this.data.officer_approved_last_name = decoded_response[2]["officer_approved_last_name"];
            this.data.dttmaccepted = decoded_response[2]["dttmaccepted"];
            this.data.canIUpdatetThisEvent = decoded_response[2]["canIUpdatetThisEvent"];
            this.loading.dismissAll();

            var d = new Date(decoded_response[2]["start_dttm"]);
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
            var strTime = hours + ':' + minutes1 + ' ' + ampm;
            this.data.start_dttm = d.getMonth()+1 + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + strTime;

            var d = new Date(decoded_response[2]["end_dttm"]);
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
            var strTime = hours + ':' + minutes1 + ' ' + ampm;
            this.data.end_dttm = d.getMonth()+1 + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + strTime;

          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push("LoginPage", { data: 'Please login again.' });
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
              console.log("Unknown problem occured.  Please contact administrator.  Code: ViewUpdateEvent-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: ViewUpdateEvent-002");
          this.loading.dismissAll();
        }
      );
  }  

}
