import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgeValidator } from  '../../validators/age';
import { PhoneValidator } from './../../validators/phone.validator';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the AddmeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addmeeting',
  templateUrl: 'addmeeting.html',
})
export class AddmeetingPage {

  meetings: any;
  data: any = {};

  submitAttempt: boolean = false;

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;
  loading: Loading;

  addMeetingForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File, 
    private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController) {
      this.data.response = "";
      this.data.error = "";
      this.data.selectedimage = "";
      this.data.currentyear = new Date().getFullYear();
      this.data.nextyear = this.data.currentyear + 1;
      this.data.countries = [];
      this.data.usastates = [];
      this.data.usacities = [];
      this.data.mychapters = [];
  }

  validation_messages = {
    'chapter': [{ type: 'required', message: 'Chapter is required.' }],
    'title': [{ type: 'required', message: 'Meeting Title is required.' }],
    'description': [{ type: 'required', message: 'Meeting Description is required.' }],
    'start_dttm': [{ type: 'required', message: 'Start Date and Time is required.' }],
    'end_dttm': [{ type: 'required', message: 'End Date and Time is required.' }],
    'venue_country': [{ type: 'required', message: 'Country is required.' }],
    'venue_usa_state': [{ type: 'required', message: 'State is required.' }],
    'venue_state': [{ type: 'required', message: 'State is required.' }],
    'venue_usa_city': [{ type: 'required', message: 'City is required.' }],
    'venue_city': [{ type: 'required', message: 'City is required.' }],
    'venue_address': [{ type: 'required', message: 'Address is required.' }],
    'venue_zipcode': [{ type: 'required', message: 'Zipcode is required.' }],
    'additional_info': [{ type: 'required', message: 'Additional Information is required.' }]
  }

  ionViewWillLoad() {
    this.addMeetingForm = this.formBuilder.group({
      chapter: ["", Validators.compose([Validators.required])],
      title: ["", Validators.compose([Validators.required])],
      description: [""],
      start_dttm: ["", Validators.compose([Validators.required])],
      end_dttm: ["", Validators.compose([Validators.required])],
      venue_country: ["", Validators.compose([Validators.required])],
      venue_usa_state: ["", Validators.compose([Validators.required])],
      venue_state: ["", Validators.compose([Validators.required])],
      venue_usa_city: ["", Validators.compose([Validators.required])],
      venue_city: ["", Validators.compose([Validators.required])],
      venue_address: ["", Validators.compose([Validators.required])],
      venue_zipcode: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      additional_info: [""]
    });
    this.populateChaptersManagedByMe();
    this.data.countries = ['United States'];
    this.populateCountries();
    this.populateUSAStates();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmeetingPage');
  }

  correctStateAndCityValidationsForVenueState() {
    //console.log(this.addMeetingForm.controls.venue_country.value);
    if(this.addMeetingForm.controls.venue_country.value == 'United States') {
      //console.log(this.addMeetingForm.controls.venue_country.value);
      this.addMeetingForm.controls.venue_state.setValue('');
      this.addMeetingForm.controls.venue_city.setValue('');
      this.addMeetingForm.controls.venue_state.setValidators([]);
      this.addMeetingForm.controls.venue_city.setValidators([]);
      this.addMeetingForm.controls.venue_usa_state.setValidators([Validators.required]);
      this.addMeetingForm.controls.venue_usa_city.setValidators([Validators.required]);
    }
    else {
      this.addMeetingForm.controls.venue_usa_state.setValue('');
      this.addMeetingForm.controls.venue_usa_city.setValue('');
      this.addMeetingForm.controls.venue_usa_state.setValidators([]);
      this.addMeetingForm.controls.venue_usa_city.setValidators([]);
      this.addMeetingForm.controls.venue_state.setValidators([Validators.required]);
      this.addMeetingForm.controls.venue_city.setValidators([Validators.required]);
    }
  }

  populateCountries() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http.post(this.shareProvider.server + "application/allcountries.php", body).subscribe(
      data => {
        //this.data.response = 'Response: ' + data["_body"];
        decoded_response = JSON.parse(data["_body"]);
        if (decoded_response[0] == "true") {
          //this.data.countries = decoded_response[2];
          //this.countries = [];
          for(var i = 1; i < decoded_response[2].length; i++) {
            try {
              if(decoded_response[2][i]['code'] != 'US') {
                this.data.countries.push(decoded_response[2][i]['name']);
              }
            }
            catch(Error) {
              //console.log("Oooops!");
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-003");
              console.log("Failed to add country code " + decoded_response[2][i]['code'] + " => Unknown problem occured.  Please contact administrator.  Code: AE-003");
            }
          }
          //this.loading.dismissAll();
        }
        else {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-004");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-004");
          //this.loading.dismissAll();
        }
      },
      error => {
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-005");
        console.log("Unknown problem occured.  Please contact administrator.  Code: AE-005");
        //this.loading.dismissAll();
      }
    );
  }

  populateUSAStates() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "application/usastates.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usastates = decoded_response[2];
          }
          //this.loading.dismissAll();
        },
        error => {
          //console.log("Oooops!");
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-006");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-006");
          //this.loading.dismissAll();
        }
      );
  }

  populateCitiesByUSAState() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('usastate', this.addMeetingForm.controls['venue_usa_state'].value);
    this.http
      .post(this.shareProvider.server + "application/usacitiesbystate.php", body)
      .subscribe(
        data => {
          //this.data.error = data["_body"];
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usacities = decoded_response[2];
          }
          this.loading.dismissAll();
        },
        error => {
          //console.log("Oooops!");
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-007");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-007");
          this.loading.dismissAll();
        }
      );
  }

  populateChaptersManagedByMe() {
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "meetings/chaptersmanagedbyme.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.mychapters = decoded_response[2];
          }
        },
        error => {
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-008");
        }
      );
  }

  request() {
    this.submitAttempt = true;
    this.correctStateAndCityValidationsForVenueState();
    if(this.addMeetingForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_chapters_id', this.addMeetingForm.controls.chapter.value);
      body.append('title', this.addMeetingForm.controls.title.value);
      body.append('description', this.addMeetingForm.controls.description.value);
      body.append('start_dttm', this.addMeetingForm.controls.start_dttm.value);
      body.append('end_dttm', this.addMeetingForm.controls.end_dttm.value);
      body.append('venue_country', this.addMeetingForm.controls.venue_country.value);
      body.append('venue_usa_state', this.addMeetingForm.controls.venue_usa_state.value);
      body.append('venue_state', this.addMeetingForm.controls.venue_state.value);
      body.append('venue_usa_city', this.addMeetingForm.controls.venue_usa_city.value);
      body.append('venue_city', this.addMeetingForm.controls.venue_city.value);
      body.append('venue_address', this.addMeetingForm.controls.venue_address.value);
      body.append('venue_zipcode', this.addMeetingForm.controls.venue_zipcode.value);
      body.append('additional_info', this.addMeetingForm.controls.additional_info.value);
      this.http.post(this.shareProvider.server + "meetings/addmeeting.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert("You've successfully added meeting.");
            this.data.isappsubmited = true;
            //this.data.submittedtext = "Thank you for submitting your application with L.A.M.A.  You'll hear back from us soon.";
            this.loading.dismissAll();
            this.navCtrl.pop();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: AE-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: AE-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: AE-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-009");
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