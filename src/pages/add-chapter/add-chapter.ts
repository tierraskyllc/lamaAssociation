import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';

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

  @ViewChild('cityComponent') cityComponent: IonicSelectableComponent;

  data: any = {};
  chapter_categories: Array<string>;
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
    public loadingCtrl: LoadingController
  ) {
      var addtype = navParams.get('addtype');
      if(addtype == 'international') {
        this.isNational = false;
        this.isInternational = true;
        this.populateAllCountries();
      }
      else {
        this.isNational = true;
        this.isInternational = false;
      }
      this.data.usaregions = [];
      this.data.usastates = [];
      this.data.usacity = [];
      this.data.citycomponentitems = [];
  }

  validation_messages = {
    'name': [{ type: 'required', message: 'Chapter Name is required.' }, { type: 'maxlength', message: 'Chapter Name can not be longer than 100 letters.' }],
    'description': [{ type: 'maxlength', message: 'Description can not be longer than 200 letters.' }],
    'chapter_category': [{ type: 'required', message: 'Chapter Category is required.' }],
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
    this.chapter_categories = ["Organized Chapter", "Establishing Chapter", "Brother Chapter"];
    this.chapterForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: ["", Validators.compose([Validators.maxLength(200)])],
      chapter_category: ["", Validators.compose([Validators.required])],
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

  populateAllCountries() {
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "chapters/listallcountries.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.intlcountry = decoded_response[2];
          }
          else {
            this.data.intlcountry = [];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );
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

  searchCity(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim();
    text = text.replace(/^(0+)/g, '');
    if (!text) {
      event.component.items = [];
      return;
    }
    else {
      event.component.items = [];
      /*event.component.items = [
        {id: 1, name: 'City1'},
        {id: 2, name: 'City2'},
        {id: 3, name: 'City3'},
        {id: 4, name: 'City4'},
      ];*/
      var decoded_response = "";
      var body = new FormData();
      var usastate = this.chapterForm.controls.state.value;
      body.append('sessionid', this.shareProvider.sessionid);
      body.append("usastate", usastate);
      body.append("searchtext", text);
      this.http
        .post(this.shareProvider.server + "chapters/usacitiesbystate.php", body)
        .subscribe(
          data => {
            //console.log(data["_body"]);
            decoded_response = JSON.parse(data["_body"]);
            if(decoded_response[0]) {
              //console.log(decoded_response[2])
              //this.data.citycomponentitems = event.component.items;
              this.data.usacity = decoded_response[2];
              event.component.items = [decoded_response[2]];
            }
          },
          error => {
            console.log("Oooops!");
          }
        );
    }
  }

  storeID(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.data.selectedusacityid = event.value.id;
  }

  add() {
    //console.log('city: ' + this.data.selectedusacityid);
    var decoded_response = "";
      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append("name", this.chapterForm.controls.name.value);
      body.append("description", this.chapterForm.controls.description.value);
      body.append("chapter_category", this.chapterForm.controls.chapter_category.value);
      if(this.isNational) {
        body.append('chapter_type', 'national');
      }
      else if(this.isInternational) {
        body.append('chapter_type', 'international');
      }
      body.append("lama_usa_regions_id", this.chapterForm.controls.region.value);
      body.append("lama_usa_states_id", this.chapterForm.controls.state.value);
      body.append("lama_usa_cities_id", this.data.selectedusacityid);
      body.append("lama_international_regions_id", this.chapterForm.controls.country.value);
      body.append("intl_region", this.chapterForm.controls.intlregion.value);
      body.append("intl_state", this.chapterForm.controls.intlstate.value);
      body.append("intl_city", this.chapterForm.controls.intlcity.value);
      body.append("intl_zipcode", this.chapterForm.controls.intlzipcode.value);
      this.http
        .post(this.shareProvider.server + "chapters/addchapter.php", body)
        .subscribe(
          data => {
            console.log(data["_body"]);
            decoded_response = JSON.parse(data["_body"]);
            if(decoded_response[0] == "true") {
              this.shareProvider.presentMessageOnlyAlert("You have successfully added a new chapter.");
              this.navCtrl.pop();
            }
            else {
              console.log("Problem adding chapter.  Please contact administrator.");
              this.shareProvider.presentMessageOnlyAlert("Problem adding chapter.  Please contact administrator.");
            }
          },
          error => {
            console.log("Problem adding chapter.  Please contact administrator.");
            this.shareProvider.presentMessageOnlyAlert("Problem adding chapter.  Please contact administrator.");
          }
        );
  }

  selectInternational() {
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

  selectNational() {
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
