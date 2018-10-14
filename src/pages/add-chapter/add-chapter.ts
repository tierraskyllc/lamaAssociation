import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the AddChapterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-chapter',
  templateUrl: 'add-chapter.html',
})
export class AddChapterPage {

  data: any = {};
  submitAttempt: boolean = false;
  isNational: boolean = false;
  isInternational: boolean = false;
  loading: Loading;
  chapterForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
      var addtype = navParams.get('addtype');
      if(addtype == 'international') {
        this.isNational = false;
        this.isInternational = true;
      }
      else {
        this.isNational = true;
        this.isInternational = false;
      }
      this.data.usaregions = [];
      this.data.usastates = [];
      this.data.usacity = [];
  }

  validation_messages = {
    'name': [{ type: 'required', message: 'Chapter Name is required.' }, { type: 'maxlength', message: 'Chapter Name can not be longer than 100 letters.' }],
    'description': [{ type: 'maxlength', message: 'Description can not be longer than 200 letters.' }],
    'region': [{ type: 'required', message: 'Region is required.' }],
    'state': [{ type: 'required', message: 'State is required.' }],
    'city': [{ type: 'required', message: 'City is required.' }],
    'country': [{ type: 'required', message: 'Country is required.' }],
    'intlregion': [{ type: 'required', message: 'Region is required.' }, { type: 'maxlength', message: 'Region can not be longer than 100 letters.' }],
    'intlstate': [{ type: 'required', message: 'State is required.' }, { type: 'maxlength', message: 'State can not be longer than 100 letters.' }],
    'intlcity': [{ type: 'required', message: 'City is required.' }, { type: 'maxlength', message: 'City can not be longer than 100 letters.' }],
    'intlzipcode': [{ type: 'required', message: 'zipcode is required.' }, { type: 'maxlength', message: 'Zipcode can not be longer than 20 letters.' }],
  }

  ionViewWillLoad() {
    this.chapterForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: ["", Validators.compose([Validators.maxLength(200)])],
      region: [""],
      state: [""],
      city: [""],
      country: [""],
      intlregion: [""],
      intlstate: [""],
      intlcity: [""],
      intlzipcode: [""]
    });
    if(this.isInternational) {
      this.chapterForm.controls.country.setValue('');
      this.chapterForm.controls.country.setValidators([Validators.required]);
      this.chapterForm.controls.intlregion.setValue('');
      this.chapterForm.controls.intlregion.setValidators([Validators.maxLength(100)]);
      this.chapterForm.controls.intlstate.setValue('');
      this.chapterForm.controls.intlstate.setValidators([Validators.maxLength(100)]);
      this.chapterForm.controls.intlcity.setValue('');
      this.chapterForm.controls.intlcity.setValidators([Validators.required, Validators.maxLength(100)]);
      this.chapterForm.controls.intlzipcode.setValue('');
      this.chapterForm.controls.intlzipcode.setValidators([Validators.maxLength(20)]);

      this.chapterForm.controls.region.setValue('');
      this.chapterForm.controls.region.setValidators([]);
      this.chapterForm.controls.state.setValue('');
      this.chapterForm.controls.state.setValidators([]);
      this.chapterForm.controls.city.setValue('');
      this.chapterForm.controls.city.setValidators([]);
    }
    else {
      this.chapterForm.controls.country.setValue('');
      this.chapterForm.controls.country.setValidators([]);
      this.chapterForm.controls.intlregion.setValue('');
      this.chapterForm.controls.intlregion.setValidators([]);
      this.chapterForm.controls.intlstate.setValue('');
      this.chapterForm.controls.intlstate.setValidators([]);
      this.chapterForm.controls.intlcity.setValue('');
      this.chapterForm.controls.intlcity.setValidators([]);
      this.chapterForm.controls.intlzipcode.setValue('');
      this.chapterForm.controls.intlzipcode.setValidators([]);

      this.chapterForm.controls.region.setValue('');
      this.chapterForm.controls.region.setValidators([Validators.required]);
      this.chapterForm.controls.state.setValue('');
      this.chapterForm.controls.state.setValidators([Validators.required]);
      this.chapterForm.controls.city.setValue('');
      this.chapterForm.controls.city.setValidators([Validators.required]);

      this.populateUSARegions();
    }
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddChapterPage');
  }

  populateUSARegions() {
    var decoded_response = "";
    var body = new FormData();
    this.http
      .post(this.shareProvider.server + "usaregions.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usaregions = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );
  }

  populateUSAStatesByRegion() {
    var decoded_response = "";
    var body = new FormData();
    var regionid = this.chapterForm.controls.region.value;
    body.append("regionid", regionid);
    this.http
      .post(this.shareProvider.server + "usastatesbyregion.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usastates = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );
    this.chapterForm.controls.state.setValue('');
    this.data.usastates = [];
    this.chapterForm.controls.city.setValue('');
    this.data.usacity = [];
  }

}
