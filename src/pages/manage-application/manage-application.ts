import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AgeValidator } from  '../../validators/age';
import { PhoneValidator } from './../../validators/phone.validator';
import { Country } from './manage-application.model';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

/**
 * Generated class for the ManageApplicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-application',
  templateUrl: 'manage-application.html',
})
export class ManageApplicationPage {

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  private signaturePadOptions: Object = {
    'minWidth': 1,
    'maxWidth': 3,
    'canvasWidth': 340,
    'canvasHeight': 180,
    'backgroundColor': "rgb(255,255,255)",
    'penColor': 'blue',
    'throttle': 0,
    'minDistance': 1
  };

  events: any;
  data: any = {};
  formdata: any = {};

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;
  loading: Loading;
  searchTimer: any;

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
  appStatus: Array<string>;

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
    private photoViewer: PhotoViewer,
    public modalCtrl: ModalController
  ) {

      this.data.lama_applications_id = navParams.get('lama_applications_id');
      
      this.data.response = "";
      this.data.error = "";
      this.data.selectedimage = "";
      this.data.insurancepic = "";
      this.data.licensepic = "";
      this.data.insurancePicURL = "";
      this.data.licensePicURL = "";
      this.data.motorcyclesobjects = [];
      this.data.isappsubmited = false;
      this.data.submittedtext = "";
      this.data.usastates = [];
      this.data.usacities = [];
      this.data.maxyear = new Date().getFullYear() + 25;
      this.data.spouse_details = null;
      this.data.today = new Date().toISOString();
      this.data.isAllergiesTextFieldVisible = false;
      
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
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.navCtrl.push('LoginPage');
            }
            else {
              //this.data.error = "Unknown problem occured.  Please contact administrator.";
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-001");
              console.log("Unknown problem occured.  Please contact administrator.  Code: APP-001");
            }
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-002");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-002");
        }
      );
      //this.getApplicationDetails();
    }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled = false;
    this.setValidationForMotorcycleInfo();
    console.log('ionViewDidLoad ManageApplicationPage');
    //this.getApplicationDetails();
  }

  ionViewWillLoad() {
    this.getApplicationDetails();
    //this.getApplicationStatus();

    this.countries = [
      new Country('US', 'United States'),
      //new Country('UY', 'Uruguay'),
      //new Country('AR', 'Argentina')
      //new Country('AF', 'Afghanistan')
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
    this.bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-", "N/A"];
    this.memberTitles = ["No Title", "President", "Vice President", "Treasurer", "Secretary", "Business Manager", "Motor Touring Officer", "Sgt of Arms", "Road Captain", "Retired"];
    this.typeOfMemberships = [];
    this.typeOfChapters = ["Organized Chapter/Capitulo", "Establishing Chapter/Capitulo Estableciendo", "Brother Chapter/Capítulo hermano"];
    this.appStatus = ['Review', 'Rejected', 'Approved'];

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
      licenseexpdt: ["", Validators.compose([Validators.required])],
      haveMotorcycleInsurance: ["", Validators.compose([Validators.required])],
      //modelOfMotorcycle1: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      //modelOfMotorcycle2: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      //modelOfMotorcycle3: new FormControl(this.modelOfMotorcycles[0], Validators.required),
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
      alrgy_que: ['', Validators.compose([])],
      allergies: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      organDonar: ["", Validators.compose([Validators.required])],
      memberTitle: ["", Validators.compose([Validators.required])],
      typeOfMembership: ["", Validators.compose([Validators.required])],
      spouse_id: ['', Validators.compose([])],
	    vrfy_spouse_info: ['', Validators.compose([])],
      //typeOfChapter: ["", Validators.compose([Validators.required])],
      applicationStatus: ["", Validators.compose([Validators.required])],
      start_date: [''],
      approved_by: [''],
      approval_date_time: [''],
      note: [''],
      motorcycles: this.formBuilder.array([])
    });

    //this.getApplicationDetails();
    //this.data.usastatetitle = "State: " + this.formdata.state;
    //this.data.usacitytitle = "City: " + this.formdata.city;

    setInterval(() => {      
      //console.log('timer');
      this.uploadImage();
      },2000);

      /*setTimeout(() => {      
        //console.log('timer');
        this.displayOdometerAndRegistrationPics();
        },5000);*/

      this.changeValidationForAnyOtherClub();
  }

  getInitialMotorcycle() {
    this.data.motorcyclesobjects.push({"odometerPic":'', "registrationPic":'', "insurancePic":''});
    return this.formBuilder.group({
      color: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      make: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      licensePlate: ['', Validators.compose([Validators.required])],
      currentMileage: ['', Validators.compose([Validators.required])],
      registrationexpdt: ['', Validators.compose([Validators.required])],
      insuranceexpdt: ['', Validators.compose([Validators.required])]
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
    this.data.motorcyclesobjects.splice(i, 1);
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
    'licenseexpdt': [{ type: 'required', message: 'License expiration date is required.'}],
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
    'allergies': [{type: 'required', message: 'Please specify allergie(s).'}, {type: 'pattern', message: 'Allergies is invalid.'}],
    'organDonar': [{ type: 'required', message: 'Please select Yes or No.' }],
    'memberTitle': [{type: 'required', message: 'Member Title is required.'}],
    'typeOfMembership': [{type: 'required', message: 'Type of Membership is required.'}],
    'spouse_id': [{type: 'required', message: 'ID Number of Your Spouse is required.'}],
	  'vrfy_spouse_info': [{type: 'required', message: 'Please indicate whether your spouse information displayed above is correct or not.'}],
    //'typeOfChapter': [{type: 'required', message: 'Type of Chapter is required.'}],
    'applicationStatus': [{ type: 'required', message: 'Application Status is required.' }],
    'note': [{ type: 'required', message: 'Note is required.' }],
    'year': [{type: 'required', message: 'Required.'}],
    'make': [{type: 'required', message: 'Required.'}],
    'model': [{type: 'required', message: 'Required.'}],
    'licensePlate': [{type: 'required', message: 'Required.'}],
    'currentMileage': [{type: 'required', message: 'Required.'}],
    'start_date': [{ type: 'required', message: 'Start Date is required.' }]
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
        }
        else {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-004");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-004");
        }
      },
      error => {
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-005");
        console.log("Unknown problem occured.  Please contact administrator.  Code: APP-005");
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
        },
        error => {
          //console.log("Oooops!");
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-006");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-006");
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
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-007");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-007");
          this.formdata.city = mycity;
          //this.data.usacitytitle = "City: " + this.formdata.city;
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

  update() {
    this.changeValidationForAnyOtherClub();
    this.submitAttempt = true;
    if(this.applicationForm.valid && (((this.applicationForm.controls['applicationStatus'].value == 'Approved') && (!this.signaturePad.isEmpty())) || (this.applicationForm.controls['applicationStatus'].value != 'Approved'))) {
    //if(this.applicationForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_applications_id', this.formdata.id);
      body.append('lama_members_id', this.formdata.lama_members_id);
      //body.append('lama_chapter_id', this.mockMember.lama_chapter_id);
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
      if(this.applicationForm.controls['typeOfMembership'].value === 'Spousal') {
        body.append('spouse_id', this.applicationForm.controls['spouse_id'].value);
      }
      //body.append('typeOfChapter', this.applicationForm.controls['typeOfChapter'].value);
      body.append('typeOfChapter', 'Not Needed');
      body.append('licenseexpdt', this.applicationForm.controls['licenseexpdt'].value);
      body.append('licensepic', this.data.licensepic);
      body.append('insurancepic', this.data.insurancepic);
      body.append('application_status', this.applicationForm.controls['applicationStatus'].value);
      body.append('note', this.applicationForm.controls['note'].value);
      //-----
      var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
      for (var i = 0; i < motorcyclesobjects.length; i++) {
        if(!((motorcyclesobjects[i]['year'] == '') && (motorcyclesobjects[i]['color'] == '') && (motorcyclesobjects[i]['make'] == '') && (motorcyclesobjects[i]['model'] == '') && (motorcyclesobjects[i]['licensePlate'] == '') && (motorcyclesobjects[i]['currentMileage'] == ''))) {
          //this.data.error = motorcyclesobjects[i]['year'] + ' ' + motorcyclesobjects[i]['color'] + ' ' + motorcyclesobjects[i]['make'] + ' ' + motorcyclesobjects[i]['model'] + ' ' + motorcyclesobjects[i]['licensePlate'] + ' ' + motorcyclesobjects[i]['currentMileage'];
          body.append('year'+i, motorcyclesobjects[i]['year']);
          body.append('color'+i, motorcyclesobjects[i]['color']);
          body.append('make'+i, motorcyclesobjects[i]['make']);
          body.append('model'+i, motorcyclesobjects[i]['model']);
          body.append('licensePlate'+i, motorcyclesobjects[i]['licensePlate']);
          body.append('currentMileage'+i, motorcyclesobjects[i]['currentMileage']);
          body.append('odometerPic'+i, this.data.motorcyclesobjects[i]['odometerPic']);
          body.append('registrationPic'+i, this.data.motorcyclesobjects[i]['registrationPic']);
          body.append('registrationexpdt'+i, motorcyclesobjects[i]['registrationexpdt']);
          body.append('insurancePic'+i, this.data.motorcyclesobjects[i]['insurancePic']);
          body.append('insuranceexpdt'+i, motorcyclesobjects[i]['insuranceexpdt']);
        }
      }
      //-----
      if(this.applicationForm.controls['applicationStatus'].value == 'Approved') {
        body.append('start_date', this.applicationForm.controls['start_date'].value);
        if(this.signaturePad.isEmpty()) {
          body.append('signaturepic', '');
        }
        else {
          body.append('signaturepic', this.signaturePad.toDataURL());
        }
      }
      else {
        body.append('signaturepic', '');
      }
      this.http.post(this.shareProvider.server + "application/update.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert(decoded_response[1]);
            this.data.isappsubmited = true;
            this.data.submittedtext = decoded_response[1];
            this.loading.dismissAll();
            this.navCtrl.pop();
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
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['odometerPic'] = newFileName;
          this.data.motorcyclesobjects[i]['odometerPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'registration'+i) {
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['registrationPic'] = newFileName;
          this.data.motorcyclesobjects[i]['registrationPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'insurance'+i) {
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['insurancePic'] = newFileName;
          this.data.motorcyclesobjects[i]['insurancePic'] = newFileName;
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
      position: 'middle',
      cssClass: 'myCSSForToast'
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
          //this.displayOdometerPic(num);
        }
        else if(/^registration[0-9]+$/.test(this.data.selectedimage)) {
          //console.log(this.data.selectedimage);
          var num = this.data.selectedimage.match(/^registration([0-9]+)$/)[1];
          //console.log(num);
          //this.displayRegistrationPic(num);
        }
        else if(/^insurance[0-9]+$/.test(this.data.selectedimage)) {
          //console.log(this.data.selectedimage);
          var num = this.data.selectedimage.match(/^insurance([0-9]+)$/)[1];
          //console.log(num);
          //this.displayRegistrationPic(num);
        }
        else if(this.data.selectedimage == 'license') {
          //this.displayLicensePic();
        }
        else if(this.data.selectedimage == 'insurance') {
          //this.displayInsurancePic();
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

  public uploadInsurance(num) {
    this.data.selectedimage = "insurance"+num;
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
    ////var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    ////if((motorcyclesobjects[num]['odometerPic'] == null) || (motorcyclesobjects[num]['odometerPic'] == '')) {
    if((this.data.motorcyclesobjects[num]['odometerPic'] == null) || (this.data.motorcyclesobjects[num]['odometerPic'] == '')) {
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
      ////body.append('docname', motorcyclesobjects[num]['odometerPic']);
      body.append('docname', this.data.motorcyclesobjects[num]['odometerPic']);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + this.data.motorcyclesobjects[num]['odometerPic'];
            //motorcyclesobjects[num]['odometerPicURL'] = docurl;
            this.photoViewer.show(docurl, 'Odometer Picture', {share: false});
            //console.log(motorcyclesobjects[num]['odometerPicURL']);
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
    ////var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    ////if((motorcyclesobjects[num]['registrationPic'] == null) || (motorcyclesobjects[num]['registrationPic'] == '')) {
    if((this.data.motorcyclesobjects[num]['registrationPic'] == null) || (this.data.motorcyclesobjects[num]['registrationPic'] == '')) {
      this.presentToast('You have not uploaded registration pic for this motorcycle yet.  You must upload one.');
    }
    else {
      //this.presentToast('I\'ll try to upload registration pic here.');
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      ////body.append('docname', motorcyclesobjects[num]['registrationPic']);
      body.append('docname', this.data.motorcyclesobjects[num]['registrationPic']);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + this.data.motorcyclesobjects[num]['registrationPic'];
            //motorcyclesobjects[num]['registrationPicURL'] = docurl;
            this.photoViewer.show(docurl, 'Registration Picture', {share: false});
            //console.log(motorcyclesobjects[num]['registrationPicURL']);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' registration picture', {share: false});
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
            //this.data.licensePicURL = docurl;
            this.photoViewer.show(docurl, 'License Picture', {share: false});
            //console.log(this.data.licensePicURL);
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

  public displayInsurancePic(num) {
    ////var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    ////if((motorcyclesobjects[num]['insurancePic'] == null) || (motorcyclesobjects[num]['insurancePic'] == '')) {
    if((this.data.motorcyclesobjects[num]['insurancePic'] == null) || (this.data.motorcyclesobjects[num]['insurancePic'] == '')) {
      this.presentToast('You have not uploaded insurance pic for this motorcycle yet.  You must upload one.');
    }
    else {
      //this.presentToast('I\'ll try to upload insurance pic here.');
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      ////body.append('docname', motorcyclesobjects[num]['insurancePic']);
      body.append('docname', this.data.motorcyclesobjects[num]['insurancePic']);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + this.data.motorcyclesobjects[num]['insurancePic'];
            //motorcyclesobjects[num]['insurancePicURL'] = docurl;
            this.photoViewer.show(docurl, 'Insurance Picture', {share: false});
            //console.log(motorcyclesobjects[num]['insurancePicURL']);
            //this.photoViewer.show(docurl, 'Motorcycle # '+ num + ' insurance picture', {share: false});
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

  getApplicationDetails() {
    //console.log(this.data.lama_applications_id);
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_applications_id', this.data.lama_applications_id);
    this.http
      .post(this.shareProvider.server + "application/fetchfullapplication.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.formdata.id = decoded_response[2]["id"];
            this.formdata.lama_members_id = decoded_response[2]["lama_members_id"];
            this.formdata.lama_chapters_id = decoded_response[2]["lama_chapters_id"];
            this.formdata.lama_member_first_name = decoded_response[2]["lama_member_first_name"];
            this.formdata.lama_member_last_name = decoded_response[2]["lama_member_last_name"];
            this.formdata.lama_chapter_name = decoded_response[2]["lama_chapter_name"];
            this.formdata.country = decoded_response[2]["country"];
            this.applicationForm.controls['country_phone'].value['country']['name'] = decoded_response[2]["country"];
            this.formdata.state = decoded_response[2]["state"];
            this.formdata.city = decoded_response[2]["city"];
            this.populateCitiesByUSAStateWithFormStateValue(decoded_response[2]["city"]);
            if(this.formdata.country == 'United States') {
              this.applicationForm.controls['usastate'].setValue(decoded_response[2]["state"]);
              this.applicationForm.controls['usacity'].setValue(decoded_response[2]["city"]);
            }
            else {
              this.applicationForm.controls['state'].setValue(decoded_response[2]["state"]);
              this.applicationForm.controls['city'].setValue(decoded_response[2]["city"]);
            }
            this.formdata.address = decoded_response[2]["address"];
            this.formdata.zipcode = decoded_response[2]["zipcode"];
            this.formdata.phone = decoded_response[2]["phone"];
            this.formdata.date_of_birth = decoded_response[2]["date_of_birth"];
            this.applicationForm.controls['dateofbirth'].setValue(decoded_response[2]["date_of_birth"]);
            this.formdata.gender = decoded_response[2]["gender"];
            this.applicationForm.controls['gender'].setValue(decoded_response[2]["gender"]);
            this.formdata.age = decoded_response[2]["age"];
            this.formdata.place_of_birth = decoded_response[2]["place_of_birth"];
            this.formdata.have_motor_cycle_license = decoded_response[2]["have_motor_cycle_license"];
            this.applicationForm.controls['haveMotorcycleLicense'].setValue(decoded_response[2]["have_motor_cycle_license"]);
            this.formdata.have_motor_cycle_insurance = decoded_response[2]["have_motor_cycle_insurance"];
            this.formdata.licenseexpdt = decoded_response[2]["licenseexpdt"];
            this.applicationForm.controls['licenseexpdt'].setValue(decoded_response[2]["licenseexpdt"]);
            this.applicationForm.controls['haveMotorcycleInsurance'].setValue(decoded_response[2]["have_motor_cycle_insurance"]);
            this.formdata.years_riding = decoded_response[2]["years_riding"];
            this.formdata.any_other_club = decoded_response[2]["any_other_club"];
            this.applicationForm.controls['anyOtherClub'].setValue(decoded_response[2]["any_other_club"]);
            this.formdata.name_of_other_club = decoded_response[2]["name_of_other_club"];
            this.applicationForm.controls['nameOfOtherClub'].setValue(decoded_response[2]["name_of_other_club"]);
            this.formdata.marital_status = decoded_response[2]["marital_status"];
            this.applicationForm.controls['maritalStatus'].setValue(decoded_response[2]["marital_status"]);
            this.formdata.number_of_children = decoded_response[2]["number_of_children"];
            this.formdata.name_of_employer = decoded_response[2]["name_of_employer"];
            this.formdata.years_employed = decoded_response[2]["years_employed"];
            this.formdata.occupation = decoded_response[2]["occupation"];
            this.formdata.annual_salary = decoded_response[2]["annual_salary"];
            this.applicationForm.controls['annualSalary'].setValue(decoded_response[2]["annual_salary"]);
            this.formdata.highest_education = decoded_response[2]["highest_education"];
            this.applicationForm.controls['highestEducation'].setValue(decoded_response[2]["highest_education"]);
            this.formdata.skills_pastimes = decoded_response[2]["skills_pastimes"];
            this.formdata.blood_type = decoded_response[2]["blood_type"];
            this.applicationForm.controls['bloodType'].setValue(decoded_response[2]["blood_type"]);
            this.formdata.allergies = decoded_response[2]["allergies"];
            if(decoded_response[2]["allergies"] === 'No') {
              this.data.isAllergiesTextFieldVisible = false;
              this.applicationForm.controls['alrgy_que'].setValue('No');
            }
            else {
              this.data.isAllergiesTextFieldVisible = true;
              this.applicationForm.controls['alrgy_que'].setValue('Yes');
            }
            this.formdata.organ_donar = decoded_response[2]["organ_donar"];
            this.applicationForm.controls['organDonar'].setValue(decoded_response[2]["organ_donar"]);
            this.formdata.member_title = decoded_response[2]["member_title"];
            this.applicationForm.controls['memberTitle'].setValue(decoded_response[2]["member_title"]);
            this.formdata.type_of_membership = decoded_response[2]["type_of_membership"];
            this.applicationForm.controls['typeOfMembership'].setValue(decoded_response[2]["type_of_membership"]);
            this.formdata.spouse_id = decoded_response[2]["spouse_id"];
            this.applicationForm.controls['spouse_id'].setValue(decoded_response[2]["spouse_id"]);
            this.formdata.type_of_chapter = decoded_response[2]["type_of_chapter"];
            //this.applicationForm.controls['typeOfChapter'].setValue(decoded_response[2]["type_of_chapter"]);
            this.formdata.licensepic = decoded_response[2]["licensepic"];
            this.data.licensepic = decoded_response[2]["licensepic"];
            this.formdata.insurancepic = decoded_response[2]["insurancepic"];
            this.data.insurancepic = decoded_response[2]["insurancepic"];
            this.formdata.signaturePic = "data:image/png;base64," + decoded_response[2]["signaturepic"];
            //console.log(this.formdata.signaturePic);
            this.formdata.application_status = decoded_response[2]["application_status"];
            this.applicationForm.controls['applicationStatus'].setValue(decoded_response[2]["application_status"]);
            if((decoded_response[2]["start_date"] == null) || (decoded_response[2]["start_date"] == 'null')) {
              this.formdata.start_date = '';
              this.applicationForm.controls['start_date'].setValue('');
            }
            else {
              this.formdata.start_date = decoded_response[2]["start_date"];
              this.applicationForm.controls['start_date'].setValue(decoded_response[2]["start_date"]);
            }
            if((decoded_response[2]["note"] == null) || (decoded_response[2]["note"] == 'null')) {
              this.formdata.note = '';
            }
            else {
              this.formdata.note = decoded_response[2]["note"];
            }
            this.applicationForm.controls['note'].setValue(decoded_response[2]["note"]);
            this.formdata.approversignaturePic = "data:image/png;base64," + decoded_response[2]["approversignaturepic"];
            this.formdata.approved_by = decoded_response[2]["approved_by"];
            this.formdata.dttmaccepted = decoded_response[2]["dttmaccepted"];
            if((this.formdata.dttmaccepted != undefined) && (this.formdata.dttmaccepted != null) && (this.formdata.dttmaccepted != 'null')) {
              var d = new Date(this.formdata.dttmaccepted.replace(/-/g,'/'));
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              this.formdata.approval_date_time = d.getMonth()+1 + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + strTime;
            }
            else {
              this.formdata.approval_date_time = '';
            }

            this.formdata.dttmcreated = decoded_response[2]["dttmcreated"];

            if(this.formdata.type_of_membership === 'Spousal') {
              this.getSpouseInfo();
            }
            if(this.applicationForm.controls["gender"].value === 'Male') {
              this.typeOfMemberships = ["Full Riding Member", "Spousal", "Associate"];
            }
            if(this.applicationForm.controls["gender"].value === 'Female') {
              this.typeOfMemberships = ["DAMA", "Spousal", "Associate"];
            }

            if((decoded_response[2]["lama_chapter_president_first_name"]) && (decoded_response[2]["lama_chapter_president_last_name"])) {
              this.data.lama_chapter_president = decoded_response[2]["lama_chapter_president_first_name"] + ' ' + decoded_response[2]["lama_chapter_president_last_name"];
            }
            else {
              this.data.lama_chapter_president = 'Not In System';
            }

            for (var i = 0; i < decoded_response[2]["motorcycles"].length; i++) {
              this.displayMotorcycle(decoded_response[2]["motorcycles"][i]['color'], decoded_response[2]["motorcycles"][i]['year'], decoded_response[2]["motorcycles"][i]['make'], decoded_response[2]["motorcycles"][i]['model'], decoded_response[2]["motorcycles"][i]['license_plate'], decoded_response[2]["motorcycles"][i]['current_mileage'], decoded_response[2]["motorcycles"][i]['odometerpic'], decoded_response[2]["motorcycles"][i]['registrationexpdt'], decoded_response[2]["motorcycles"][i]['registrationpic'], decoded_response[2]["motorcycles"][i]['insuranceexpdt'], decoded_response[2]["motorcycles"][i]['insurancepic']);
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
  
  setValidationForMotorcycleInfo() {
    this.applicationForm.controls.spouse_id.setValue(null);
	  this.applicationForm.controls.vrfy_spouse_info.setValue(null);
    if(this.applicationForm.controls.typeOfMembership.value == 'Associate') {
      var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
      var looplen = motorcyclesobjects.length - 1;
      for (var i = looplen; i >= 0; i--) {
        this.removeMotorcycle(i);
      }
      this.applicationForm.get("haveMotorcycleLicense").setValidators([]);
      this.applicationForm.get("haveMotorcycleLicense").updateValueAndValidity();
      this.applicationForm.get("haveMotorcycleInsurance").setValidators([]);
      this.applicationForm.get("haveMotorcycleInsurance").updateValueAndValidity();
      this.applicationForm.get("yearsRiding").setValidators([]);
      this.applicationForm.get("yearsRiding").updateValueAndValidity();
      this.applicationForm.get("licenseexpdt").setValidators([]);
      this.applicationForm.get("licenseexpdt").updateValueAndValidity();
    }
    else {
      this.applicationForm.get("haveMotorcycleLicense").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("haveMotorcycleLicense").updateValueAndValidity();
      this.applicationForm.get("haveMotorcycleInsurance").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("haveMotorcycleInsurance").updateValueAndValidity();
      this.applicationForm.get("yearsRiding").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("yearsRiding").updateValueAndValidity();
      this.applicationForm.get("licenseexpdt").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("licenseexpdt").updateValueAndValidity();
    }
    if(this.applicationForm.controls.typeOfMembership.value == 'Spousal') {
      this.applicationForm.get("spouse_id").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("vrfy_spouse_info").setValidators([Validators.compose([Validators.required])]);
    }
    else {
      this.applicationForm.get("spouse_id").setValidators([]);
      this.applicationForm.get("vrfy_spouse_info").setValidators([]);
    }
  }
  
  pickUSACity() {
    console.log('pickUSACity clicked');
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present().then(() => {
      let cityModal = this.modalCtrl.create("PickacityPage", { cities: this.data.usacities, myloadingcontroller: this.loading });
      cityModal.onDidDismiss(returneddata => {
        //console.log(returneddata.selectedcity);
        if(returneddata.selectedcity.toString() !== "undefined") {
          this.applicationForm.get("usacity").setValue(returneddata.selectedcity);
        }
        else {
          this.applicationForm.get("usacity").setValue('');
        }
      });
      cityModal.present();
    })
  }

  getMotorcycle(color, year, make, model, licensePlate, currentMileage, odometerPic, registrationexpdt, registrationPic, insuranceexpdt, insurancePic) {
    this.data.motorcyclesobjects.push({"odometerPic":odometerPic, "registrationPic":registrationPic, "insurancePic":insurancePic});
    return this.formBuilder.group({
      color: [color],
      year: [year],
      make: [make],
      model: [model],
      licensePlate: [licensePlate],
      currentMileage: [currentMileage],
      registrationexpdt: [registrationexpdt],
      insuranceexpdt: [insuranceexpdt]
    });
  }

  displayMotorcycle(color, year, make, model, licensePlate, currentMileage, odometerPic, registrationexpdt, registrationPic, insuranceexpdt, insurancePic) {
    const control = <FormArray>this.applicationForm.controls['motorcycles'];
    control.push(this.getMotorcycle(color, year, make, model, licensePlate, currentMileage, odometerPic, registrationexpdt, registrationPic, insuranceexpdt, insurancePic));
    //this.displayMotorCycles();
  }

  changeValidationForApplicationStatus() {
    if(this.applicationForm.controls.applicationStatus.value != 'Rejected') {
      this.applicationForm.get("note").setValidators([]);
      this.applicationForm.get("note").updateValueAndValidity();
    }
    if(this.applicationForm.controls.applicationStatus.value == 'Rejected') {
      this.applicationForm.get("note").setValidators([Validators.required]);
      this.applicationForm.get("note").updateValueAndValidity();
    }
  }

  displayOdometerAndRegistrationPics() {
    console.log("Called displayOdometerAndRegistrationPics");
    var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    for (var i = 0; i < motorcyclesobjects.length; i++) {
      this.displayOdometerPic(i);
      this.displayRegistrationPic(i);
    }
  }

  clearSignature() {
    //console.log(this.signaturePad.toDataURL());
    this.signaturePad.clear();
    //console.log('After Clearing Signature Image');
    //console.log(this.signaturePad.toDataURL());
  }

  processMe() {
    if(this.applicationForm.controls['applicationStatus'].value == 'Approved') {
      this.applicationForm.controls['start_date'].setValidators([Validators.required]);
    }
    else {
      this.applicationForm.controls['start_date'].setValidators([]);
    }
  }

  populateMembershipTypes() {
    this.applicationForm.controls['typeOfMembership'].setValue(null);
    if(this.applicationForm.controls["gender"].value === 'Male') {
      this.typeOfMemberships = ["Full Riding Member", "Spousal", "Associate"];
    }
    if(this.applicationForm.controls["gender"].value === 'Female') {
      this.typeOfMemberships = ["DAMA", "Spousal", "Associate"];
    }
  }

  searchSpouse() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.getSpouseInfo();
      },2000);
  }

  getSpouseInfo() {
    //console.log('getSpouseInfo function called.');
    this.applicationForm.controls["vrfy_spouse_info"].setValue(null);
    var decoded_response = "";
      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('spouse_id', this.applicationForm.controls['spouse_id'].value);
      this.loading = this.shareProvider.startLoading(this.loadingCtrl, 'Searching for your spouse\'s information...');
      this.http
      .post(this.shareProvider.server + "application/spouseinfo.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] === "true") {
            this.data.spouse_details = decoded_response[1];
            this.shareProvider.stopLoading(this.loading);
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              this.data.spouse_details = 'error';
              this.shareProvider.stopLoading(this.loading);
              this.navCtrl.push('LoginPage');
            }
            else {
              this.data.spouse_details = 'error';
              console.log("Unknown problem occured.  Please contact administrator.  Code: APP-00111");
              this.shareProvider.stopLoading(this.loading);
            }
          }
        },
        error => {
          this.data.spouse_details = 'error';
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-00222");
          this.shareProvider.stopLoading(this.loading);
        }
      );
  }

  setValidationForLicenseExpDate() {
    if(this.applicationForm.controls['haveMotorcycleLicense'].value === 'No') {
      if((this.applicationForm.controls['typeOfMembership'].value === 'Full Riding Member') || (this.applicationForm.controls['typeOfMembership'].value === 'DAMA')) {
        this.typeOfMemberships = ["Spousal", "Associate"];
        this.applicationForm.controls['typeOfMembership'].setValue(null);
      }
      this.applicationForm.get("licenseexpdt").setValidators([]);
      this.applicationForm.get("licenseexpdt").updateValueAndValidity();
    }
    else {
      if(this.applicationForm.controls["gender"].value === 'Male') {
        this.typeOfMemberships = ["Full Riding Member", "Spousal", "Associate"];
      }
      if(this.applicationForm.controls["gender"].value === 'Female') {
        this.typeOfMemberships = ["DAMA", "Spousal", "Associate"];
      }
      this.applicationForm.get("licenseexpdt").setValidators([Validators.compose([Validators.required])]);
      this.applicationForm.get("licenseexpdt").updateValueAndValidity();
    }
  }

  changeValueOfAllergies(allergies) {
    if(allergies === 'No') {
      this.applicationForm.controls['allergies'].setValue('No');
      this.formdata.allergies = 'No';
      this.data.isAllergiesTextFieldVisible = false;
    }
    else {
      this.applicationForm.controls['allergies'].setValue('');
      this.formdata.allergies = '';
      this.data.isAllergiesTextFieldVisible = true;
    }
  }

}