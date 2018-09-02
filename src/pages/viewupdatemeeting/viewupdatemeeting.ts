import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the ViewupdatemeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewupdatemeeting',
  templateUrl: 'viewupdatemeeting.html',
})
export class ViewupdatemeetingPage {

  data: any = {};
  loading: Loading;
  submitAttempt: boolean = false;
  updateMeetingForm: FormGroup;

  meetingRequestStatus: Array<string>;

  validation_messages = {
    'request_status': [{ type: 'required', message: 'Meeting Request Status is required.' }]
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.data.lama_meetings_id = navParams.get('lama_meetings_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewupdatemeetingPage');
  }

  ionViewWillLoad() {
    //this.getMeeting();
    this.updateMeetingForm = this.formBuilder.group({
      request_status: ["", Validators.compose([Validators.required])]
    });
    this.meetingRequestStatus = ['Review', 'Rejected', 'Approved'];
  }

  public ionViewWillEnter() {
    this.getMeeting();
  }

  getMeeting() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_meetings_id', this.data.lama_meetings_id);
    this.http
      .post(this.shareProvider.server + "meetings/getmeeting.php", body)
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
            this.updateMeetingForm.controls.request_status.setValue(decoded_response[2]["request_status"]);
            this.data.officer_approved_first_name = decoded_response[2]["officer_approved_first_name"];
            this.data.officer_approved_last_name = decoded_response[2]["officer_approved_last_name"];
            this.data.dttmaccepted = decoded_response[2]["dttmaccepted"];
            this.data.canIUpdatetThisMeeting = decoded_response[2]["canIUpdatetThisMeeting"];
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: ViewUpdateMeeting-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: ViewUpdateMeeting-002");
          this.loading.dismissAll();
        }
      );
  }

  update() {
    this.submitAttempt = true;
    if(this.updateMeetingForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_meetings_id', this.data.lama_meetings_id);
      body.append('request_status', this.updateMeetingForm.controls.request_status.value);
      this.http.post(this.shareProvider.server + "meetings/updatemeeting.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert("You've successfully updated meeting request for this meeting.");
            this.data.isappsubmited = true;
            //this.data.submittedtext = "Thank you for submitting your application with L.A.M.A.  You'll hear back from us soon.";
            this.loading.dismissAll();
            this.navCtrl.pop();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: VUE-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: VUE-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: VUE-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: VUE-009");
          this.loading.dismissAll();
        }
      );
    }
    else {
      this.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

}