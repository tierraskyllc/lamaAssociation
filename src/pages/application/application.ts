import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgeValidator } from  '../../validators/age';
import { PhoneValidator } from './../../validators/phone.validator';
import { Country } from './application.model';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';

import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
//import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'page-application',
  templateUrl: 'application.html'
})
export class ApplicationPage {

  events: any;
  data: any = {};

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;
  loading: Loading;

  mockMember = {
    firstName : "",
    lastName : "",
    title: "",
    chapter: "",
    email: "",
    lama_chapter_id: ""
  };

  applicationForm: FormGroup;
  country_phone_group: FormGroup;

  emailMask = emailMask;

  countries: Array<Country>;
  genders: Array<string>;
  yesOrNo: Array<string>;
  modelOfMotorcycles: Array<string>;
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
    private camera: Camera, 
    //private transfer: Transfer,
    private transfer: FileTransfer,
    private file: File, 
    private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController,
    //private photoViewer: PhotoViewer
    ) {
      
      this.data.response = "";
      this.data.error = "";
      this.data.selectedimage = "";
      this.data.insurancepic = "";
      this.data.licensepic = "";
      this.data.insurancePicURL = "";
      this.data.licensePicURL = "";
      this.data.isappsubmited = false;
      this.data.submittedtext = "";

      this.data.usastates = [];
      this.data.usacities = [];

      /*this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();*/

      var decoded_response = "";
      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      this.http
      .post(this.shareProvider.server + "profile/profile.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.mockMember.firstName = decoded_response[2]['first_name'];
            this.mockMember.lastName = decoded_response[2]['last_name'];
            this.mockMember.chapter = decoded_response[2]['chapter_name'];
            this.mockMember.lama_chapter_id = decoded_response[2]['lama_chapter_id'];
            //this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
              //this.loading.dismissAll();
            }
            else {
              //this.data.error = "Unknown problem occured.  Please contact administrator.";
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-001");
              console.log("Unknown problem occured.  Please contact administrator.  Code: APP-001");
              //this.loading.dismissAll();
            }
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-002");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-002");
          //this.loading.dismissAll();
        }
      );
    }

  ionViewDidLoad() {
    //this.populateCountries();
    console.log('ionViewDidLoad ApplicationPage');
  }

  ionViewWillLoad() {
    this.getApplicationStatus();

    this.countries = [
      new Country('US', 'United States'),
      //new Country('UY', 'Uruguay'),
      //new Country('AR', 'Argentina')
      new Country('AF', 'Afghanistan')
    ];
    //this.countries = [];
    this.populateCountries();
    this.populateUSAStates();

    this.genders = ["Male", "Female"];
    this.yesOrNo = ["Yes", "No"];
    this.modelOfMotorcycles = ["-Select-","Harley", "Honda", "Suzuki", "Kawasaki", "BMW", "Yamaha"];
    this.maritalStatus = ["Married", "Single", "Divorced", "Widowed" ];
    this.annualSalary = ["Retired", "$20,000 ~ $40,000", "$50,000 ~ $70,000", "$80,000 +", "UnEmployed"];
    this.highestEducation = ["Self Taught", "Home Schooled", "High School", "Vocational School", "College"];
    this.bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
    this.memberTitles = ["No Title", "President", "Vice President", "Treasurer", "Secretary", "Business Manager", "Motor Touring Officer", "Sgt of Arms", "Road Captain", "Retired"];
    this.typeOfMemberships = ["Full Color Member", "DAMA", "Spousal/Pareja", "Prospect", "Probate", "Associate/Asociado"];
    this.typeOfChapters = ["Organized Chapter/Capitulo", "Establishing Chapter/Capitulo Estableciendo", "Brother Chapter/Capítulo hermano"];

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([Validators.required, PhoneValidator.validCountryPhone(country)]));

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.applicationForm = this.formBuilder.group({
      //firstName: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      //lastName: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      //email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      address: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      city: ['', Validators.compose([])],
      state: ['', Validators.compose([])],
      usastate: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      usacity: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      zipCode: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      country_phone: this.country_phone_group,
      dateofbirth: ["", Validators.compose([Validators.required])],
      // gender: [(this.genders[0], Validators.required)],
      //gender: new FormControl(this.genders[0], Validators.required),
      gender: ["", Validators.compose([Validators.required])],
      age: ['', Validators.required],
      placeOfBirth: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      yearsRiding: ['', Validators.required],
      haveMotorcycleLicense: ["", Validators.compose([Validators.required])],
      haveMotorcycleInsurance: ["", Validators.compose([Validators.required])],
      modelOfMotorcycle1: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      modelOfMotorcycle2: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      modelOfMotorcycle3: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      //licensePlate1: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      //licensePlate2: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      //licensePlate3: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
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
      // bloodType: ['', new FormControl(this.bloodTypes[0], Validators.required)],
      bloodType: ["", Validators.compose([Validators.required])],
      allergies: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      organDonar: ["", Validators.compose([Validators.required])],
      memberTitle: ["", Validators.compose([Validators.required])],
      typeOfMembership: ["", Validators.compose([Validators.required])],
      typeOfChapter: ["", Validators.compose([Validators.required])],
      motorcycles: this.formBuilder.array([
        this.getInitialMotorcycle()
      ])
    });
    setInterval(() => {      
      //console.log('timer');
      this.uploadImage();
      },2000);
  }

  getInitialMotorcycle() {
    return this.formBuilder.group({
      color: [''],
      year: [''],
      make: [''],
      model: [''],
      licensePlate: [''],
      currentMileage: [''],
      odometerPic: [''],
      odometerPicURL: [''],
      registrationPic: [''],
      registrationPicURL: ['']
    });
  }

  addMotorcycle() {
    const control = <FormArray>this.applicationForm.controls['motorcycles'];
    control.push(this.getInitialMotorcycle());
    //this.displayMotorCycles();
  }

  removeMotorcycle(i: number) {
    const control = <FormArray>this.applicationForm.controls['motorcycles'];
    control.removeAt(i);
  }

  validation_messages = {
    //'firstName': [{type: 'required', message: 'First Name is required.'}],
    //'lastName': [{type: 'required', message: 'Last Name is required.'}],
    //'email': [{type: 'required', message: 'Email is required.' }, {type: 'pattern', message: 'Enter a valid email.'}],
    'address': [{type: 'required', message: 'Address is required.'}, {type: 'minlength', message: 'Address can not be this short.'}, {type: 'maxlength', message: 'Address can not be longer than 200 characters.'}],
    'city': [{type: 'required', message: 'City is required.'}, {type: 'pattern', message: 'City is invalid.'}],
    'state': [{type: 'required', message: 'State is required.'}, {type: 'pattern', message: 'State is invalid.'}],
    'usastate': [{type: 'required', message: 'State is required.'}],
    'usacity': [{type: 'required', message: 'City is required.'}],
    'zipCode': [{type: 'required', message: 'Zip Code is required.'}, {type: 'pattern', message: 'Enter a valid Zip Code.'}],
    'phone': [{ type: 'required', message: 'Phone is required.' }, { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }],
    'dateofbirth': [{ type: 'required', message: 'Date of Birth is required.'}],
    'gender': [{ type: 'required', message: 'Gender is required.' }],
    'haveMotorcycleLicense': [{ type: 'required', message: 'Please select Yes or No.' }],
    'haveMotorcycleInsurance': [{ type: 'required', message: 'Please select Yes or No.' }],
    'age': [{ type: 'required', message: 'Age is required.' }],
    'placeOfBirth': [{type: 'required', message: 'Place of Birth is required.'}, {type: 'pattern', message: 'Place of birth is invalid.'}],
    'yearsRiding': [{ type: 'required', message: 'Years Riding is required.' }],
    //'licensePlate1': [{type: 'required', message: 'License Plate #1 is required.'}],
    //'licensePlate2': [{type: 'required', message: 'License Plate #2 is required.'}],
    //'licensePlate3': [{type: 'required', message: 'License Plate #3 is required.'}],
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
    'typeOfChapter': [{type: 'required', message: 'Type of Chapter is required.'}],
    'year': [{type: 'required', message: 'Required.'}],
    'make': [{type: 'required', message: 'Required.'}],
    'model': [{type: 'required', message: 'Required.'}],
    'licensePlate': [{type: 'required', message: 'Required.'}],
    'currentMileage': [{type: 'required', message: 'Required.'}]
  }

  onEvent(event: string, item: any, e: any) {
    if (e) {
        e.stopPropagation();
    }
    if (this.events[event]) {
        this.events[event](item);
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
                this.countries.push(new Country(decoded_response[2][i]['code'], decoded_response[2][i]['name']));
              }
            }
            catch(Error) {
              //console.log("Oooops!");
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-003");
              console.log("Failed to add country code " + decoded_response[2][i]['code'] + " => Unknown problem occured.  Please contact administrator.  Code: APP-003");
            }
          }
          //this.loading.dismissAll();
        }
        else {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-004");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-004");
          //this.loading.dismissAll();
        }
      },
      error => {
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-005");
        console.log("Unknown problem occured.  Please contact administrator.  Code: APP-005");
        //this.loading.dismissAll();
      }
    );
  }

  calculateAge() {
    var diff = new Date().getTime() - new Date(this.applicationForm.controls['dateofbirth'].value).getTime();
    this.applicationForm.controls['age'].setValue(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
  }

  displayMotorCycles() {
    //this.data.error = JSON.stringify(this.applicationForm.controls['motorcycles'].value);
    var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    for (var i = 0; i < motorcyclesobjects.length; i++) {
      //this.data.error = this.data.error.concat(' ' + motorcyclesobjects[i]['color']);
      //this.data.error = motorcyclesobjects[i]['color'];
      if(!((motorcyclesobjects[i]['year'] == '') && (motorcyclesobjects[i]['color'] == '') && (motorcyclesobjects[i]['make'] == '') && (motorcyclesobjects[i]['model'] == '') && (motorcyclesobjects[i]['licensePlate'] == '') && (motorcyclesobjects[i]['currentMileage'] == ''))) {
        this.data.error = motorcyclesobjects[i]['year'] + ' ' + motorcyclesobjects[i]['color'] + ' ' + motorcyclesobjects[i]['make'] + ' ' + motorcyclesobjects[i]['model'] + ' ' + motorcyclesobjects[i]['licensePlate'] + ' ' + motorcyclesobjects[i]['currentMileage'];
      }
    }
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
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-006");
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
    body.append('usastate', this.applicationForm.controls['usastate'].value);
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
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-007");
          this.loading.dismissAll();
        }
      );
  }

  correctStateAndCityValidations() {
    //this.data.error = this.applicationForm.controls['country_phone'].value['country']['name'];
    if(this.applicationForm.controls['country_phone'].value['country']['name'] == 'United States') {
      this.applicationForm.controls['usastate'].setValue('');
      this.applicationForm.controls['usacity'].setValue('');
      this.populateUSAStates();
      this.applicationForm.controls['state'].setValidators([]);
      this.applicationForm.controls['city'].setValidators([]);
      this.applicationForm.controls['usastate'].setValidators([Validators.required]);
      this.applicationForm.controls['usacity'].setValidators([Validators.required]);
    }
    else {
      this.applicationForm.controls['usastate'].setValidators([]);
      this.applicationForm.controls['usacity'].setValidators([]);
      this.applicationForm.controls['state'].setValidators([Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])]);
      this.applicationForm.controls['city'].setValidators([Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])]);
    }
  }

  review() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    this.submitAttempt = true;
    if(this.applicationForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_chapter_id', this.mockMember.lama_chapter_id);
      body.append('country', this.applicationForm.controls['country_phone'].value['country']['name']);
      body.append('usastate', this.applicationForm.controls['usastate'].value);
      body.append('state', this.applicationForm.controls['state'].value);
      body.append('usacity', this.applicationForm.controls['usacity'].value);
      body.append('city', this.applicationForm.controls['city'].value);
      body.append('address', this.applicationForm.controls['address'].value);
      body.append('zipCode', this.applicationForm.controls['zipCode'].value);
      body.append('phone', this.applicationForm.controls['country_phone'].value['phone']);
      body.append('dateofbirth', this.applicationForm.controls['dateofbirth'].value);
      body.append('gender', this.applicationForm.controls['gender'].value);
      body.append('age', this.applicationForm.controls['age'].value);
      body.append('placeOfBirth', this.applicationForm.controls['placeOfBirth'].value);
      body.append('haveMotorcycleLicense', this.applicationForm.controls['haveMotorcycleLicense'].value);
      body.append('haveMotorcycleInsurance', this.applicationForm.controls['haveMotorcycleInsurance'].value);
      body.append('yearsRiding', this.applicationForm.controls['yearsRiding'].value);
      body.append('anyOtherClub', this.applicationForm.controls['anyOtherClub'].value);
      body.append('nameOfOtherClub', this.applicationForm.controls['nameOfOtherClub'].value);
      body.append('maritalStatus', this.applicationForm.controls['maritalStatus'].value);
      body.append('numberOfChildren', this.applicationForm.controls['numberOfChildren'].value);
      body.append('nameOfEmployer', this.applicationForm.controls['nameOfEmployer'].value);
      body.append('yearsEmployed', this.applicationForm.controls['yearsEmployed'].value);
      body.append('occupation', this.applicationForm.controls['occupation'].value);
      body.append('annualSalary', this.applicationForm.controls['annualSalary'].value);
      body.append('highestEducation', this.applicationForm.controls['highestEducation'].value);
      body.append('skillsPastimes', this.applicationForm.controls['skillsPastimes'].value);
      body.append('bloodType', this.applicationForm.controls['bloodType'].value);
      body.append('allergies', this.applicationForm.controls['allergies'].value);
      body.append('organDonar', this.applicationForm.controls['organDonar'].value);
      body.append('memberTitle', this.applicationForm.controls['memberTitle'].value);
      body.append('typeOfMembership', this.applicationForm.controls['typeOfMembership'].value);
      body.append('typeOfChapter', this.applicationForm.controls['typeOfChapter'].value);
      body.append('licensepic', this.data.licensepic);
      body.append('insurancepic', this.data.insurancepic);
      //-----
      var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
      for (var i = 0; i < motorcyclesobjects.length; i++) {
        if(!((motorcyclesobjects[i]['year'] == '') && (motorcyclesobjects[i]['color'] == '') && (motorcyclesobjects[i]['make'] == '') && (motorcyclesobjects[i]['model'] == '') && (motorcyclesobjects[i]['licensePlate'] == '') && (motorcyclesobjects[i]['currentMileage'] == '') && (motorcyclesobjects[i]['odometerPic'] == '') && (motorcyclesobjects[i]['registrationPic'] == ''))) {
          //this.data.error = motorcyclesobjects[i]['year'] + ' ' + motorcyclesobjects[i]['color'] + ' ' + motorcyclesobjects[i]['make'] + ' ' + motorcyclesobjects[i]['model'] + ' ' + motorcyclesobjects[i]['licensePlate'] + ' ' + motorcyclesobjects[i]['currentMileage'];
          body.append('year'+i, motorcyclesobjects[i]['year']);
          body.append('color'+i, motorcyclesobjects[i]['color']);
          body.append('make'+i, motorcyclesobjects[i]['make']);
          body.append('model'+i, motorcyclesobjects[i]['model']);
          body.append('licensePlate'+i, motorcyclesobjects[i]['licensePlate']);
          body.append('currentMileage'+i, motorcyclesobjects[i]['currentMileage']);
          body.append('odometerPic'+i, motorcyclesobjects[i]['odometerPic']);
          body.append('registrationPic'+i, motorcyclesobjects[i]['registrationPic']);
        }
      }
      //-----
      this.http.post(this.shareProvider.server + "application/review.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert("You've successfully submitted your application.");
            this.data.isappsubmited = true;
            this.data.submittedtext = "Thank you for submitting your application with L.A.M.A.  You'll hear back from us soon.";
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: APP-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-009");
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

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.lastImageFullPath = correctPath + currentName;
          });
      } else {
        //this.presentMessageOnlyAlert('checkpoint-1');
        //this.presentMessageOnlyAlert(imagePath);
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //this.presentMessageOnlyAlert('checkpoint-2');
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.presentMessageOnlyAlert('checkpoint-3');
        //this.presentMessageOnlyAlert(correctPath);
        //this.presentMessageOnlyAlert(currentName);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        //this.presentMessageOnlyAlert('checkpoint-4');
        this.lastImageFullPath = imagePath;
      }
      //this.uploadImage();
    }, (err) => {
      this.presentToast('Error while selecting image.' + err);
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  this.shareProvider.username + '_' + this.data.selectedimage + '_' + n + ".jpg";
    if(this.data.selectedimage == 'license') {
      this.data.licensepic = newFileName;
    }
    else if(this.data.selectedimage == 'insurance') {
      this.data.insurancepic = newFileName;
    }
    else {
      var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
      for (var i = 0; i < motorcyclesobjects.length; i++) {
        if(this.data.selectedimage == 'odometer'+i) {
          var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          motorcyclesobjects[i]['odometerPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'registration'+i) {
          var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          motorcyclesobjects[i]['registrationPic'] = newFileName;
          break;
        }
      }
    }
    //this.presentMessageOnlyAlert(newFileName);
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    //this.presentMessageOnlyAlert(this.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.lastImage = newFileName;
      //this.presentToast('Error while storing file.');
      console.log('Error while storing file.  This error can be safely ignored.');
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 10000,
      position: 'top'
    });
    toast.present();
  }
  
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    //this.presentToast('Inside uploadImage');
    if((this.lastImage != "") && (this.lastImageFullPath != "") && (this.isUploadImageRunning != true)) {
      //this.presentToast('Inside uploadImage');
      this.isUploadImageRunning = true;
      //this.presentToast(this.lastImage);
      //this.presentToast(this.lastImageFullPath);
    // Destination URL
      var url = this.shareProvider.server + "application/upload.php";
    
      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
    
      // File name only
      var filename = this.lastImage;
    
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'sessionid': this.shareProvider.sessionid}
      };
    
      const fileTransfer: FileTransferObject = this.transfer.create();
    
      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();
    
      // Use the FileTransfer to upload the image
      fileTransfer.upload(this.lastImageFullPath, url, options).then((data) => {
        this.loading.dismissAll();
        this.presentToast('Image succesful uploaded.');
        //this.presentToast(this.lastImage);
        this.lastImage = "";
        this.lastImageFullPath = "";
        this.isUploadImageRunning = false;
        if(/^odometer[0-9]+$/.test(this.data.selectedimage)) {
          //console.log(this.data.selectedimage);
          var num = this.data.selectedimage.match(/^odometer([0-9]+)$/)[1];
          //console.log(num);
          this.displayOdometerPic(num);
        }
        else if(/^registration[0-9]+$/.test(this.data.selectedimage)) {
          //console.log(this.data.selectedimage);
          var num = this.data.selectedimage.match(/^registration([0-9]+)$/)[1];
          //console.log(num);
          this.displayRegistrationPic(num);
        }
        else if(this.data.selectedimage == 'license') {
          this.displayLicensePic();
        }
        else if(this.data.selectedimage == 'insurance') {
          this.displayInsurancePic();
        }
      }, (err) => {
        this.loading.dismissAll();
        this.presentToast('Error while uploading image(s).');
        this.isUploadImageRunning = false;
      });
    }
  }

  public uploadLicense() {
    this.data.selectedimage = "license";
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadInsurance() {
    this.data.selectedimage = "insurance";
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadOdometer(num) {
    this.data.selectedimage = "odometer"+num;
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadRegistration(num) {
    this.data.selectedimage = "registration"+num;
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public displayOdometerPic(num) {
    var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    if((motorcyclesobjects[num]['odometerPic'] == null) || (motorcyclesobjects[num]['odometerPic'] == '')) {
      this.presentToast('You have not uploaded odometer pic for this motorcycle yet.  You must upload one.');
    }
    else {
      //this.presentToast('I\'ll try to upload odometer pic here.');
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('docname', motorcyclesobjects[num]['odometerPic']);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + motorcyclesobjects[num]['odometerPic'];
            motorcyclesobjects[num]['odometerPicURL'] = docurl;
            console.log(motorcyclesobjects[num]['odometerPicURL']);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' odometer picture', {share: false});
            //this.photoViewer.show(docurl);
            //----------
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: APP-108");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-109");
          this.loading.dismissAll();
        }
      );
    }
  }

  public displayRegistrationPic(num) {
    var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    if((motorcyclesobjects[num]['registrationPic'] == null) || (motorcyclesobjects[num]['registrationPic'] == '')) {
      this.presentToast('You have not uploaded registration pic for this motorcycle yet.  You must upload one.');
    }
    else {
      //this.presentToast('I\'ll try to upload odometer pic here.');
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('docname', motorcyclesobjects[num]['registrationPic']);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + motorcyclesobjects[num]['registrationPic'];
            motorcyclesobjects[num]['registrationPicURL'] = docurl;
            console.log(motorcyclesobjects[num]['registrationPicURL']);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' odometer picture', {share: false});
            //this.photoViewer.show(docurl);
            //----------
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: APP-118");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-119");
          this.loading.dismissAll();
        }
      );
    }
  }

  public displayLicensePic() {
    if((this.data.licensepic == null) || (this.data.licensepic == '')) {
      this.presentToast('You have not uploaded license pic yet.  You must upload one.');
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('docname', this.data.licensepic);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + this.data.licensepic;
            this.data.licensePicURL = docurl;
            console.log(this.data.licensePicURL);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' odometer picture', {share: false});
            //this.photoViewer.show(docurl);
            //----------
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: APP-128");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-129");
          this.loading.dismissAll();
        }
      );
    }
  }

  public displayInsurancePic() {
    if((this.data.insurancepic == null) || (this.data.insurancepic == '')) {
      this.presentToast('You have not uploaded insurance pic yet.  You must upload one.');
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('docname', this.data.insurancepic);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + this.data.insurancepic;
            this.data.insurancePicURL = docurl;
            console.log(this.data.insurancePicURL);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' odometer picture', {share: false});
            //this.photoViewer.show(docurl);
            //----------
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: APP-138");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-139");
          this.loading.dismissAll();
        }
      );
    }
  }

  getApplicationStatus() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    //this.submitAttempt = true;
    var body = new FormData();
    var json_encoded_response = "";
    var decoded_response = "";
    body.append('sessionid', this.shareProvider.sessionid);
    //-----
    this.http.post(this.shareProvider.server + "application/appstatus.php", body).subscribe(
      data => {
        decoded_response = JSON.parse(data["_body"]);
        //console.log("=====");
        //console.log(data["_body"]);
        //console.log("=====");
        if (decoded_response[0] == "true") {
          if(decoded_response[2] == 'NoApplication') {
            this.data.isappsubmited = false;
            this.data.apprejectionnote = '';
            //this.data.submittedtext = "Your application has been approved.  You are being redirected to your profile page.";
            //this.navCtrl.push("ProfilePage");
            //this.shareProvider.curentpage = "ProfilePage";
          }
			    else if(decoded_response[2] == null) {
            this.data.isappsubmited = true;
            this.data.submittedtext = "Thank you for submitting your application with L.A.M.A.  You'll hear back from us soon.";
            this.data.apprejectionnote = '';
          }
          else if(decoded_response[2] == 'Review') {
            this.data.isappsubmited = true;
            this.data.submittedtext = "We are currently reviewing your application.  You'll hear back from us soon.";
            this.data.apprejectionnote = '';
          }
          else if(decoded_response[2] == 'Approved') {
            this.data.isappsubmited = true;
            this.data.submittedtext = "Your application has been approved.  You are being redirected to your profile page.";
            this.data.apprejectionnote = '';
            this.navCtrl.push("ProfilePage");
            this.shareProvider.curentpage = "ProfilePage";
          }
          else if(decoded_response[2] == 'Rejected') {
            this.data.isappsubmited = true;
            this.data.submittedtext = "Your application has been rejected.";
            if((decoded_response[3] == null) ||(decoded_response[3] == 'null')) {
              this.data.apprejectionnote = '';
            }
            else {
              this.data.apprejectionnote = decoded_response[3];
            }
            //this.navCtrl.push("ProfilePage");
            //this.shareProvider.curentpage = "ProfilePage";
          }
        }
        else {
          this.data.isappsubmited = false;
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-018");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-018");
        }
        //this.loading.dismissAll();
      },
      error => {
        this.data.isappsubmited = true;
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-019");
        console.log("Unknown problem occured.  Please contact administrator.  Code: APP-019");
        //this.loading.dismissAll();
      }
    );
  }

  changeValidationForAnyOtherClub() {
    //console.log('changeValidationForAnyOtherClub clicked');
    //console.log(this.applicationForm.controls.anyOtherClub.value);
    if(this.applicationForm.controls.anyOtherClub.value == 'No') {
      //console.log('No selected');
      this.applicationForm.get("nameOfOtherClub").setValidators([]);
      this.applicationForm.get("nameOfOtherClub").updateValueAndValidity();
    }
    if(this.applicationForm.controls.anyOtherClub.value == 'Yes') {
      this.applicationForm.get("nameOfOtherClub").setValidators([Validators.required, Validators.maxLength(40)]);
      this.applicationForm.get("nameOfOtherClub").updateValueAndValidity();
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

}
