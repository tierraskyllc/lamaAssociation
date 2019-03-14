import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PhoneValidator } from './../../validators/phone.validator';
import { Country } from './manage-member.model';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { PasswordValidator } from './../../validators/password.validator';

/**
 * Generated class for the ManageMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-member',
  templateUrl: 'manage-member.html',
})
export class ManageMemberPage {

  data: any = {};
  formdata: any = {};
  loading: Loading;
  memberForm: FormGroup;
  country_phone_group: FormGroup;
  changePasswordForm: FormGroup;
  matching_passwords_group: FormGroup;

  emailMask = emailMask;

  countries: Array<Country>;
  genders: Array<string>;
  yesOrNo: Array<string>;
  maritalStatus: Array<string>;
  annualSalary: Array<string>;
  highestEducation: Array<string>;
  bloodTypes: Array<string>;
  memberTitles: Array<string>;
  typeOfMemberships: Array<string>;
  typeOfChapters: Array<string>;

  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.data.lama_members_id = navParams.get('lama_members_id');  
      this.data.response = "";
      this.data.error = "";
      this.data.ismemsubmited = false;
      this.data.submittedtext = "";
      this.data.usastates = [];
      this.data.usacities = [];
      this.data.maxyear = new Date().getFullYear() + 25;
  }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled = false;
    this.getCaptcha();
    console.log('ionViewDidLoad ManageMemberPage');
  }

  ionViewWillLoad() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,16}')])),
      confirm_password: new FormControl('', Validators.required)},
      (formGroup: FormGroup) => {return PasswordValidator.areEqual(formGroup);
    });
    this.changePasswordForm = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group,
      captcha_text: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("[a-zA-Z0-9]+")])]
    });

    this.getMemberDetails();

    this.countries = [
      new Country('US', 'United States'),
    ];
    this.populateCountries();
    this.populateUSAStates();

    this.genders = ["Male", "Female"];
    this.yesOrNo = ["Yes", "No"];
    this.maritalStatus = ["Married", "Single", "Divorced", "Widowed" ];
    this.annualSalary = ["Retired", "$20,000 ~ $40,000", "$50,000 ~ $70,000", "$80,000 +", "UnEmployed"];
    this.highestEducation = ["Self Taught", "Home Schooled", "High School", "Vocational School", "College"];
    this.bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-", "N/A"];
    this.memberTitles = ["No Title", "President", "Vice President", "Treasurer", "Secretary", "Business Manager", "Motor Touring Officer", "Sgt of Arms", "Road Captain", "Retired"];
    this.typeOfMemberships = ["Riding Member", "DAMA", "Spousal/Pareja", "Prospect", "Probate", "Associate/Asociado"];
    this.typeOfChapters = ["Organized Chapter/Capitulo", "Establishing Chapter/Capitulo Estableciendo", "Brother Chapter/Capítulo hermano"];

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([Validators.required, PhoneValidator.validCountryPhone(country)]));

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.memberForm = this.formBuilder.group({
      first_name: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      last_name: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),address: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      chapter_name: ["", Validators.compose([Validators.required])],
      city: ['', Validators.compose([])],
      state: ['', Validators.compose([])],
      usastate: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      usacity: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      zipCode: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      country_phone: this.country_phone_group,
      dateofbirth: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      age: ['', Validators.required],
      placeOfBirth: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      yearsRiding: ['', Validators.required],
      anyOtherClub: ["", Validators.compose([Validators.required])],
      nameOfOtherClub: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      maritalStatus: ["", Validators.compose([Validators.required])],
      numberOfChildren: [''],
      nameOfEmployer: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      yearsEmployed: ['', Validators.compose([Validators.required])],
      occupation: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      annualSalary: ["", Validators.compose([Validators.required])],
      highestEducation: ["", Validators.compose([Validators.required])],
      skillsPastimes: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      bloodType: ["", Validators.compose([Validators.required])],
      allergies: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      organDonar: ["", Validators.compose([Validators.required])],
      memberTitle: ["", Validators.compose([Validators.required])],
      typeOfMembership: ["", Validators.compose([Validators.required])],
      start_date: [''],
    });

    this.changeValidationForAnyOtherClub();
  }

  validation_messages = {
    'first_name': [{ type: "required", message: "First Name is required." }, { type: "pattern", message: "Enter a valid First Name." }],
    'last_name': [{ type: "required", message: "Last Name is required." }, { type: "pattern", message: "Enter a valid Last Name." }],
    'email': [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    'chapter_name': [{type: 'required', message: 'Chapter Name is required.'}],
    'address': [{type: 'required', message: 'Address is required.'}, {type: 'minlength', message: 'Address can not be this short.'}, {type: 'maxlength', message: 'Address can not be longer than 200 characters.'}],
    'city': [{type: 'required', message: 'City is required.'}, {type: 'pattern', message: 'City is invalid.'}],
    'state': [{type: 'required', message: 'State is required.'}, {type: 'pattern', message: 'State is invalid.'}],
    'usastate': [{type: 'required', message: 'State is required.'}],
    'usacity': [{type: 'required', message: 'City is required.'}],
    'zipCode': [{type: 'required', message: 'Zip Code is required.'}, {type: 'pattern', message: 'Enter a valid Zip Code.'}],
    'phone': [{ type: 'required', message: 'Phone is required.' }, { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }],
    'dateofbirth': [{ type: 'required', message: 'Date of Birth is required.'}],
    'gender': [{ type: 'required', message: 'Gender is required.' }],
    'age': [{ type: 'required', message: 'Age is required.' }],
    'placeOfBirth': [{type: 'required', message: 'Place of Birth is required.'}, {type: 'pattern', message: 'Place of birth is invalid.'}],
    'yearsRiding': [{ type: 'required', message: 'Years Riding is required.' }],
    'anyOtherClub': [{ type: 'required', message: 'Please select Yes or No.' }],
    'nameOfOtherClub': [{type: 'required', message: 'If YES enter club.'}, {type: 'pattern', message: 'Name of other club is invalid.'}],
    'maritalStatus': [{ type: 'required', message: 'Please select marital status.' }],
    'nameOfEmployer': [{type: 'required', message: 'Name of employer OR Self Employed OR Not Employed OR Something Else...'}, {type: 'pattern', message: 'Name of employer is invalid.'}],
    'yearsEmployed': [{ type: 'required', message: 'Years Employed is required, if Employed.  If not, enter 0 please.' }],
    'occupation': [{type: 'required', message: 'Occupation is required.'}, {type: 'pattern', message: 'Occupation is invalid.'}],
    'annualSalary': [{ type: 'required', message: 'Annual salary is required.' }],
    'skillsPastimes': [{type: 'required', message: 'SkillsPastimes is required.'}, {type: 'pattern', message: 'Skiils pastimes is invalid.'}],
    'highestEducation': [{type: 'required', message: 'Highest Education is required.'}],
    'bloodType': [{type: 'required', message: 'Blood Type is required.'}],
    'allergies': [{type: 'required', message: 'Do you have any alergies?  If yes, please specify.  If no, then write "no alergies".'}, {type: 'pattern', message: 'Allergies is invalid.'}],
    'organDonar': [{ type: 'required', message: 'Please select Yes or No.' }],
    'memberTitle': [{type: 'required', message: 'Member Title is required.'}],
    'typeOfMembership': [{type: 'required', message: 'Type of Membership is required.'}],
    'start_date': [{ type: 'required', message: 'Start Date is required.' }],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    captcha_text: [
      { type: "required", message: "Please enter text displayed in picture above." },
      { type: "pattern", message: "Text you entered is not valid." }
    ]
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
                this.countries.push(new Country(decoded_response[2][i]['code'], decoded_response[2][i]['name']));
              }
            }
            catch(Error) {
              //console.log("Oooops!");
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-003");
              console.log("Failed to add country code " + decoded_response[2][i]['code'] + " => Unknown problem occured.  Please contact administrator.  Code: MEM-003");
            }
          }
        }
        else {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-004");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-004");
        }
      },
      error => {
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-005");
        console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-005");
      }
    );
  }

  calculateAge() {
    var diff = new Date().getTime() - new Date(this.memberForm.controls['dateofbirth'].value).getTime();
    this.memberForm.controls['age'].setValue(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
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
        },
        error => {
          //console.log("Oooops!");
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-006");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-006");
        }
      );
  }

  populateCitiesByUSAState() {
    //this.data.usastatetitle = "State";
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('usastate', this.memberForm.controls['usastate'].value);
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
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-007");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-007");
          this.loading.dismissAll();
        }
      );
  }

  populateCitiesByUSAStateWithFormStateValue(mycity: string) {
    //this.data.usastatetitle = "State";
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('usastate', this.formdata.state);
    this.http
      .post(this.shareProvider.server + "application/usacitiesbystate.php", body)
      .subscribe(
        data => {
          //this.data.error = data["_body"];
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usacities = decoded_response[2];
          }
          this.formdata.city = mycity;
          //this.data.usacitytitle = "City: " + this.formdata.city;
          this.loading.dismissAll();
        },
        error => {
          //console.log("Oooops!");
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-007");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-007");
          this.formdata.city = mycity;
          //this.data.usacitytitle = "City: " + this.formdata.city;
          this.loading.dismissAll();
        }
      );
  }

  correctStateAndCityValidations() {
    //this.data.error = this.memberForm.controls['country_phone'].value['country']['name'];
    if(this.memberForm.controls['country_phone'].value['country']['name'] == 'United States') {
      this.memberForm.controls['usastate'].setValue('');
      this.memberForm.controls['usacity'].setValue('');
      this.populateUSAStates();
      this.memberForm.controls['state'].setValidators([]);
      this.memberForm.controls['city'].setValidators([]);
      this.memberForm.controls['usastate'].setValidators([Validators.required]);
      this.memberForm.controls['usacity'].setValidators([Validators.required]);
    }
    else {
      this.memberForm.controls['usastate'].setValidators([]);
      this.memberForm.controls['usacity'].setValidators([]);
      this.memberForm.controls['state'].setValidators([Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])]);
      this.memberForm.controls['city'].setValidators([Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])]);
    }
  }

  update() {
    this.changeValidationForAnyOtherClub();
    this.submitAttempt = true;
    if(this.memberForm.valid) {
      /*
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();
      */

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.formdata.lama_members_id);
      body.append('lama_profiles_id', this.formdata.lama_profiles_id);
      if(this.memberForm.controls['first_name'].touched) {
        this.data.isformchanged = true;
        body.append('first_name', this.memberForm.controls['first_name'].value);
      }
      if(this.memberForm.controls['last_name'].touched) {
        this.data.isformchanged = true;
        body.append('last_name', this.memberForm.controls['last_name'].value);
      }
      if(this.memberForm.controls['email'].touched) {
        this.data.isformchanged = true;
        body.append('email', this.memberForm.controls['email'].value);
      }
      if(this.memberForm.controls['chapter_name'].touched) {
        this.data.isformchanged = true;
        body.append('chapter_name', this.memberForm.controls['chapter_name'].value);
      }
      //if(this.memberForm.controls['country_phone'].touched) {
        this.data.isformchanged = true;
        body.append('country', this.memberForm.controls['country_phone'].value['country']['name']);
      //}
      //if(this.memberForm.controls['usastate'].touched) {
        this.data.isformchanged = true;
        body.append('usastate', this.memberForm.controls['usastate'].value);
      //}
      //if(this.memberForm.controls['state'].touched) {
        this.data.isformchanged = true;
        body.append('state', this.memberForm.controls['state'].value);
      //}
      //console.log('Inside update function.  usacity: '+this.formdata.usacity);
      //if(this.memberForm.controls['usacity'].touched) {
      //  this.data.isformchanged = true;
        body.append('usacity', this.formdata.usacity);
      //}
      //if(this.memberForm.controls['city'].touched) {
      //  this.data.isformchanged = true;
        body.append('city', this.memberForm.controls['city'].value);
      //}
      if(this.memberForm.controls['address'].touched) {
        this.data.isformchanged = true;
        body.append('address', this.memberForm.controls['address'].value);
      }
      if(this.memberForm.controls['zipCode'].touched) {
        this.data.isformchanged = true;
        body.append('zipCode', this.memberForm.controls['zipCode'].value);
      }
      if(this.memberForm.controls['country_phone'].touched) {
        this.data.isformchanged = true;
        body.append('phone', this.memberForm.controls['country_phone'].value['phone']);
      }
      if(this.memberForm.controls['dateofbirth'].touched) {
        this.data.isformchanged = true;
        body.append('dateofbirth', this.memberForm.controls['dateofbirth'].value);
      }
      if(this.memberForm.controls['gender'].touched) {
        this.data.isformchanged = true;
        body.append('gender', this.memberForm.controls['gender'].value);
      }
      if((this.memberForm.controls['age'].touched) || (this.memberForm.controls['dateofbirth'].touched)) {
        this.data.isformchanged = true;
        body.append('age', this.memberForm.controls['age'].value);
      }
      if(this.memberForm.controls['placeOfBirth'].touched) {
        this.data.isformchanged = true;
        body.append('placeOfBirth', this.memberForm.controls['placeOfBirth'].value);
      }
      if(this.memberForm.controls['yearsRiding'].touched) {
        this.data.isformchanged = true;
        body.append('yearsRiding', this.memberForm.controls['yearsRiding'].value);
      }
      if(this.memberForm.controls['anyOtherClub'].touched) {
        this.data.isformchanged = true;
        body.append('anyOtherClub', this.memberForm.controls['anyOtherClub'].value);
      }
      if(this.memberForm.controls['nameOfOtherClub'].touched) {
        this.data.isformchanged = true;
        body.append('nameOfOtherClub', this.memberForm.controls['nameOfOtherClub'].value);
      }
      if(this.memberForm.controls['maritalStatus'].touched) {
        this.data.isformchanged = true;
        body.append('maritalStatus', this.memberForm.controls['maritalStatus'].value);
      }
      if(this.memberForm.controls['numberOfChildren'].touched) {
        this.data.isformchanged = true;
        body.append('numberOfChildren', this.memberForm.controls['numberOfChildren'].value);
      }
      if(this.memberForm.controls['nameOfEmployer'].touched) {
        this.data.isformchanged = true;
        body.append('nameOfEmployer', this.memberForm.controls['nameOfEmployer'].value);
      }
      if(this.memberForm.controls['yearsEmployed'].touched) {
        this.data.isformchanged = true;
        body.append('yearsEmployed', this.memberForm.controls['yearsEmployed'].value);
      }
      if(this.memberForm.controls['occupation'].touched) {
        this.data.isformchanged = true;
        body.append('occupation', this.memberForm.controls['occupation'].value);
      }
      if(this.memberForm.controls['annualSalary'].touched) {
        this.data.isformchanged = true;
        body.append('annualSalary', this.memberForm.controls['annualSalary'].value);
      }
      if(this.memberForm.controls['highestEducation'].touched) {
        this.data.isformchanged = true;
        body.append('highestEducation', this.memberForm.controls['highestEducation'].value);
      }
      if(this.memberForm.controls['skillsPastimes'].touched) {
        this.data.isformchanged = true;
        body.append('skillsPastimes', this.memberForm.controls['skillsPastimes'].value);
      }
      if(this.memberForm.controls['bloodType'].touched) {
        this.data.isformchanged = true;
        body.append('bloodType', this.memberForm.controls['bloodType'].value);
      }
      if(this.memberForm.controls['allergies'].touched) {
        this.data.isformchanged = true;
        body.append('allergies', this.memberForm.controls['allergies'].value);
      }
      if(this.memberForm.controls['organDonar'].touched) {
        this.data.isformchanged = true;
        body.append('organDonar', this.memberForm.controls['organDonar'].value);
      }
      if(this.memberForm.controls['memberTitle'].touched) {
        this.data.isformchanged = true;
        body.append('memberTitle', this.memberForm.controls['memberTitle'].value);
      }
      if(this.memberForm.controls['typeOfMembership'].touched) {
        this.data.isformchanged = true;
        body.append('typeOfMembership', this.memberForm.controls['typeOfMembership'].value);
      }
      if(this.memberForm.controls['start_date'].touched) {
        this.data.isformchanged = true;
        body.append('start_date', this.memberForm.controls['start_date'].value);
      }
      if(!this.data.isformchanged) {
        this.presentMessageOnlyAlert('You have not changed any information for this member.');
        return;
      }
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      this.http.post(this.shareProvider.server + "members/update.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert(decoded_response[1]);
            this.data.ismemsubmited = true;
            this.data.submittedtext = decoded_response[1];
            this.loading.dismissAll();
            this.navCtrl.pop();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: MEM-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: MEM-009");
          this.loading.dismissAll();
        }
      );
    }
    else {
      this.presentMessageOnlyAlert('Did you miss one or more required fields?');
      //this.loading.dismissAll();
    }
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

  changeValidationForAnyOtherClub() {
    //console.log('changeValidationForAnyOtherClub clicked');
    //console.log(this.memberForm.controls.anyOtherClub.value);
    if(this.memberForm.controls.anyOtherClub.value == 'No') {
      //console.log('No selected');
      this.memberForm.get("nameOfOtherClub").setValidators([]);
      this.memberForm.get("nameOfOtherClub").updateValueAndValidity();
    }
    if(this.memberForm.controls.anyOtherClub.value == 'Yes') {
      this.memberForm.get("nameOfOtherClub").setValidators([Validators.required, Validators.maxLength(40)]);
      this.memberForm.get("nameOfOtherClub").updateValueAndValidity();
    }
  }

  displayLoadingForSpecificTime(seconds: number) {
    console.log('displayLoading called');
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismissAll();
      console.log('loading dismissed from displayLoading');
    }, seconds);
  }

  getMemberDetails() {
    //console.log(this.data.lama_members_id);
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_members_id', this.data.lama_members_id);
    this.http
      .post(this.shareProvider.server + "members/fetchmemberprofile.php", body)
      .subscribe(
        data => {
          console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.formdata.lama_profiles_id = decoded_response[2]["lama_profiles_id"];
            this.formdata.lama_members_id = decoded_response[2]["lama_members_id"];
            this.formdata.chapter_name = decoded_response[2]["chapter_name"];
            this.formdata.first_name = decoded_response[2]["first_name"];
            this.formdata.last_name = decoded_response[2]["last_name"];
            this.formdata.email = decoded_response[2]["username"];
            this.formdata.country = decoded_response[2]["country"];
            this.memberForm.controls['country_phone'].value['country']['name'] = decoded_response[2]["country"];
            this.formdata.state = decoded_response[2]["state"];
            this.formdata.city = decoded_response[2]["city"];
            this.populateCitiesByUSAStateWithFormStateValue(decoded_response[2]["city"]);
            if(this.formdata.country == 'United States') {
              this.memberForm.controls['usastate'].setValue(decoded_response[2]["state"]);
              this.memberForm.controls['usacity'].setValue(decoded_response[2]["city"]);
              this.formdata.usacity = decoded_response[2]["city"];
            }
            else {
              this.memberForm.controls['state'].setValue(decoded_response[2]["state"]);
              this.memberForm.controls['city'].setValue(decoded_response[2]["city"]);
            }
            this.formdata.address = decoded_response[2]["address"];
            this.formdata.zipcode = decoded_response[2]["zipcode"];
            this.formdata.phone = decoded_response[2]["phone"];
            this.formdata.date_of_birth = decoded_response[2]["date_of_birth"];
            this.memberForm.controls['dateofbirth'].setValue(decoded_response[2]["date_of_birth"]);
            this.formdata.gender = decoded_response[2]["gender"];
            this.memberForm.controls['gender'].setValue(decoded_response[2]["gender"]);
            this.formdata.age = decoded_response[2]["age"];
            this.formdata.place_of_birth = decoded_response[2]["place_of_birth"];
            this.formdata.years_riding = decoded_response[2]["years_riding"];
            this.formdata.any_other_club = decoded_response[2]["any_other_club"];
            this.memberForm.controls['anyOtherClub'].setValue(decoded_response[2]["any_other_club"]);
            this.formdata.name_of_other_club = decoded_response[2]["name_of_other_club"];
            this.formdata.marital_status = decoded_response[2]["marital_status"];
            this.memberForm.controls['maritalStatus'].setValue(decoded_response[2]["marital_status"]);
            this.formdata.number_of_children = decoded_response[2]["number_of_children"];
            this.formdata.name_of_employer = decoded_response[2]["name_of_employer"];
            this.formdata.years_employed = decoded_response[2]["years_employed"];
            this.formdata.occupation = decoded_response[2]["occupation"];
            this.formdata.annual_salary = decoded_response[2]["annual_salary"];
            this.memberForm.controls['annualSalary'].setValue(decoded_response[2]["annual_salary"]);
            this.formdata.highest_education = decoded_response[2]["highest_education"];
            this.memberForm.controls['highestEducation'].setValue(decoded_response[2]["highest_education"]);
            this.formdata.skills_pastimes = decoded_response[2]["skills_pastimes"];
            this.formdata.blood_type = decoded_response[2]["blood_type"];
            this.memberForm.controls['bloodType'].setValue(decoded_response[2]["blood_type"]);
            this.formdata.allergies = decoded_response[2]["allergies"];
            this.formdata.organ_donar = decoded_response[2]["organ_donar"];
            this.memberForm.controls['organDonar'].setValue(decoded_response[2]["organ_donar"]);
            this.formdata.member_title = decoded_response[2]["member_title"];
            this.memberForm.controls['memberTitle'].setValue(decoded_response[2]["member_title"]);
            this.formdata.type_of_membership = decoded_response[2]["type_of_membership"];
            this.memberForm.controls['typeOfMembership'].setValue(decoded_response[2]["type_of_membership"]);
            this.formdata.type_of_chapter = decoded_response[2]["type_of_chapter"];
            if((decoded_response[2]["start_date"] == null) || (decoded_response[2]["start_date"] == 'null')) {
              this.formdata.start_date = '';
              this.memberForm.controls['start_date'].setValue('');
            }
            else {
              this.formdata.start_date = decoded_response[2]["start_date"];
              this.memberForm.controls['start_date'].setValue(decoded_response[2]["start_date"]);
            }

            this.loading.dismissAll();
          }
          else if (decoded_response[0] == "false") {
            this.data.error = decoded_response[2];
            console.log(decoded_response[2]);
            this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
              this.loading.dismissAll();
            }
            else {
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              console.log("Unknown problem occured.  Please contact administrator. - MA001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          console.log("Unknown problem occured.  Please contact administrator. - MA002");
          this.loading.dismissAll();
        }
      );
    //-----
  }
  
  pickUSACity() {
    console.log('pickUSACity clicked');
    this.data.isformchanged = true;
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present().then(() => {
      let cityModal = this.modalCtrl.create("PickacityPage", { cities: this.data.usacities, myloadingcontroller: this.loading });
      cityModal.onDidDismiss(returneddata => {
        //console.log(returneddata.selectedcity);
        if(returneddata.selectedcity.toString() !== "undefined") {
          this.formdata.usacity = returneddata.selectedcity;
          this.memberForm.get("usacity").setValue(returneddata.selectedcity);
          this.memberForm.controls['usacity'].setValue(returneddata.selectedcity);
        }
        else {
          this.memberForm.get("usacity").setValue('');
          this.memberForm.controls['usacity'].setValue('');
        }
      });
      cityModal.present();
    })
    //console.log(this.formdata.usacity);
  }

  changePassword() {
    this.submitAttempt = true;
    if (this.changePasswordForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('captcha_text', this.changePasswordForm.controls.captcha_text.value);
      body.append('lama_members_id', this.formdata.lama_members_id);
      body.append("password", this.matching_passwords_group.controls.password.value);
      this.http
        .post(this.shareProvider.server + "members/changepasswd.php", body)
        .subscribe(
          data => {
            json_encoded_response = data["_body"];
            //console.log(json_encoded_response);
            decoded_response = JSON.parse(json_encoded_response);
            //console.log(decoded_response);
            if (decoded_response[0] === "error") {
              this.data.error = decoded_response[1];
              this.presentMessageOnlyAlert(decoded_response[1]);
            } else {
              if (decoded_response[0]) {
                this.presentMessageOnlyAlert(decoded_response[2]);
                this.navCtrl.pop();
              } 
              else if (!decoded_response[0]) {
                this.data.error = decoded_response[2];
                this.presentMessageOnlyAlert(decoded_response[2]);
              } else {
                this.data.error = "Problem changing password.  Please check your internet connection.  Contact administrator if problem persists.";
                this.presentMessageOnlyAlert("Problem changing password.  Please check your internet connection.  Contact administrator if problem persists.");
              }
            }
          },
          error => {
            this.data.error =
              "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
          }
        );
    }
  }

  getCaptcha() {
    var json_encoded_response = '';
    var decoded_response = '';
    //--
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "captcha/getcaptcha.php", body)
      .subscribe(
        data => {
          json_encoded_response = data["_body"];
          //console.log(json_encoded_response);
          decoded_response = JSON.parse(json_encoded_response);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            this.data.captcha = "data:image/png;base64," + decoded_response[1];
          }
          else {
            this.data.error = 'System problem.  Please contact administrator.';
            console.log('System problem.  Please contact administrator-ManageMem-003');
          }
        },
        error => {
          this.data.error = 'System problem.  Please contact administrator.';
          console.log('System problem.  Please contact administrator-ManageMem-004');
        }
      )
    //--
  }

  refreshCaptcha() {
    var json_encoded_response = '';
    var decoded_response = '';
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "captcha/getcaptcha.php", body)
      .subscribe(
        data => {
          json_encoded_response = data["_body"];
          decoded_response = JSON.parse(json_encoded_response);
          if(decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            this.data.captcha = "data:image/png;base64," + decoded_response[1];
          }
          else {
            this.data.error = 'System problem.  Please contact administrator.';
            console.log('System problem.  Please contact administrator-ManageMem-005');
          }
        },
        error => {
          this.data.error = 'System problem.  Please contact administrator.';
          console.log('System problem.  Please contact administrator-ManageMem-006');
        }
      )
  }

}
