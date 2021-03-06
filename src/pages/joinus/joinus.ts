import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, LoadingController, Loading } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { PasswordValidator } from './../../validators/password.validator';
//import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaComponent } from 'ng-recaptcha';
//import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

@IonicPage()
@Component({
  selector: "page-joinus",
  templateUrl: "joinus.html"
})
export class JoinUsPage {

  @ViewChild('content') content:any;

  joinUsForm: FormGroup;
  matching_passwords_group: FormGroup;
  data: any = {};
  response: null;
  submitAttempt: boolean = false;
  params: any = {};
  email: string;
  loading: Loading;

  constructor(public formBuilder: FormBuilder, private http: Http, private shareProvider: ShareProvider, public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.data.response = "";
    //this.data.error = "";
    this.data.chapter_related_message_flag = false;
    this.data.chapter_related_message = '';
    this.data.nationalSelected = false;
    this.data.intlSelected = false;
    this.data.usaregions = [];
    this.data.usastates = [];
    this.data.usachapters = [];
    this.data.countries = [];
    this.data.intlchapters = [];
  }

  ionViewWillLoad() {

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,16}')])),
      confirm_password: new FormControl('', Validators.required)},
      (formGroup: FormGroup) => {return PasswordValidator.areEqual(formGroup);
    });

    this.joinUsForm = this.formBuilder.group({
      firstname: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      lastname: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      matching_passwords: this.matching_passwords_group,
      selection: ["", Validators.compose([Validators.required])],
      region: ["", Validators.compose([Validators.required])],
      state: ["", Validators.compose([Validators.required])],
      chapter: ["", Validators.compose([Validators.required])],
      country: ["", Validators.compose([Validators.required])],
      intlchapter: ["", Validators.compose([Validators.required])],
      captcha_text: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("[a-zA-Z0-9]+")])]
    });

  }

  validation_messages = {
    'firstname': [{ type: "required", message: "First Name is required." }],
    lastname: [{ type: "required", message: "Last Name is required." }],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
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
  };

  selectNational() {
    this.data.nationalSelected = true;
    this.data.intlSelected = false;
    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  selectInternational() {
    this.data.intlSelected = true;
    this.data.nationalSelected = false;
    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  /*presubmit(invisible) {
    this.submitAttempt = true;
    if(this.joinUsForm.valid) {
      invisible.reset();
      invisible.execute();
    }
  }*/

  //submit(captchaResponse: string) {
    submit() {
    //console.log('captchaResponse: ' + captchaResponse);
    this.submitAttempt = true;
    //console.log(this.joinUsForm.valid);
    //console.log('firstname: ' + this.joinUsForm.controls.firstname.valid);
    //console.log('lastname: ' + this.joinUsForm.controls.lastname.valid);
    //console.log('email: ' + this.joinUsForm.controls.email.valid);
    //console.log('password: ' + this.joinUsForm.controls.password.valid);
    //console.log('selection: ' + this.joinUsForm.controls.selection.valid);
    //console.log('region: ' + this.joinUsForm.controls.region.valid);
    //console.log('state: ' + this.joinUsForm.controls.state.valid);
    //console.log('chapter: ' + this.joinUsForm.controls.chapter.valid);
    //console.log('country: ' + this.joinUsForm.controls.country.valid);
    //console.log('intlchapter: ' + this.joinUsForm.controls.intlchapter.valid);
    if (this.joinUsForm.valid) {

      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      //body.append("captchaResponse", captchaResponse);
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('captcha_text', this.joinUsForm.controls.captcha_text.value);
      body.append("email", this.joinUsForm.controls.email.value);
      body.append("firstname", this.joinUsForm.controls.firstname.value);
      body.append("lastname", this.joinUsForm.controls.lastname.value);
      body.append("password", this.matching_passwords_group.controls.password.value);
      body.append("selection", this.joinUsForm.controls.selection.value);
      body.append("chapter", this.joinUsForm.controls.chapter.value);
      body.append("intlchapter", this.joinUsForm.controls.intlchapter.value);
      this.http
        .post(this.shareProvider.server + "signup/signup.php", body)
        .subscribe(
          data => {
            //console.log(data["_body"]);
            json_encoded_response = data["_body"];
            decoded_response = JSON.parse(json_encoded_response);
            if (decoded_response[0] === "error") {
              this.data.error = decoded_response[1];
              this.content.scrollToTop();
              this.loading.dismissAll();
            } else {
              if (decoded_response[0]) {
                this.shareProvider.curentpage = "SignUpSuccessPage";
                this.loading.dismissAll();
                this.navCtrl.push("SignUpSuccessPage");
                //this.loading.dismissAll();
              } else if (!decoded_response[0]) {
                this.data.error = decoded_response[2];
                this.content.scrollToTop();
                this.loading.dismissAll();
              } else {
                this.data.error = "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
                this.content.scrollToTop();
                this.loading.dismissAll();
              }
            }
            /*=====
          if(decoded_response[0] == true) {
            this.shareProvider.curentpage = 'SignupsuccessPage';
          }
          else if(decoded_response[0] == false) {
            this.data.error = decoded_response[2];
          }
          else if(decoded_response[0] == "error") {
            this.data.error = decoded_response[1];
          }
          else {
            this.data.error = "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
            //console.log("Oooops!");
          }
          =====*/
          },
          error => {
            //console.log(error);
            this.data.error = "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
            this.content.scrollToTop();
            this.loading.dismissAll();
            //console.log("Oooops!");
          }
        );
    }
  }

  populateUSARegions() {
    this.joinUsForm.patchValue({ state: "", chapter: "" });
    this.data.usastates = [];
    this.data.usachapters = [];
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

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateUSAStatesByRegion() {
    this.joinUsForm.patchValue({ state: "", chapter: "" });
    this.data.usachapters = [];
    var decoded_response = "";
    var body = new FormData();
    var regionid = this.joinUsForm.controls.region.value;
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

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateUSAChaptersByState() {
    this.joinUsForm.patchValue({ chapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var stateid = this.joinUsForm.controls.state.value;
    body.append("stateid", stateid);
    this.http
      .post(this.shareProvider.server + "usachaptersbystate.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usachapters = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateCountries() {
    this.joinUsForm.patchValue({ country: "", intlchapter: "" });
    this.data.intlchapters = [];
    var decoded_response = "";
    var body = new FormData();
    this.http.post(this.shareProvider.server + "countries.php", body).subscribe(
      data => {
        //this.data.response = 'Response: ' + data["_body"];
        decoded_response = JSON.parse(data["_body"]);
        if (decoded_response[0]) {
          this.data.countries = decoded_response[2];
        }
        //this.data.countries = decoded_response;
      },
      error => {
        console.log("Oooops!");
      }
    );

    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateIntlChaptersByReg() {
    this.joinUsForm.patchValue({ intlchapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var countryid = this.joinUsForm.controls.country.value;
    body.append("countryid", countryid);
    this.http
      .post(this.shareProvider.server + "intlchaptersbyreg.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.intlchapters = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  ionViewDidLoad() {
    this.populateUSARegions();
    this.populateCountries();
    this.createSignUpSession();
    console.log("ionViewDidLoad JoinUsPage");
  }

  checkChapterCategory(chapter_name, chapter_category) {
    if(chapter_category === 'Organizing Chapter') {
      //console.log('Selected Establishing Chapter');
      this.data.chapter_related_message_flag = true;
      this.data.chapter_related_message = chapter_name + ' is an ' + chapter_category + ' which means it is in probation period.  Please contact us at support@tierrasky.com for additional informaton.';
    }
    else {
      this.data.chapter_related_message_flag = false;
      this.data.chapter_related_message = '';
    }
  }

  createSignUpSession() {
    var json_encoded_response = '';
    var decoded_response = '';
    var body = new FormData();
    this.http
        .post(this.shareProvider.server + "signup/start_signup.php", body)
        .subscribe(
          data => {
            json_encoded_response = data["_body"];
            decoded_response = JSON.parse(json_encoded_response);
            if (decoded_response[0] === "true") {
              this.shareProvider.sessionid = decoded_response[1];
              //console.log('this.shareProvider.sessionid = ' + this.shareProvider.sessionid);
              json_encoded_response = '';
              decoded_response = '';
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
                      console.log('System problem.  Please contact administrator-JoinUs-003');
                    }
                  },
                  error => {
                    this.data.error = 'System problem.  Please contact administrator.';
                    console.log('System problem.  Please contact administrator-JoinUs-004');
                  }
                )
            }
            else {
              this.data.error = 'System problem.  Please contact administrator.';
              console.log('System problem.  Please contact administrator-JoinUs-001');
            }
          },
          error => {
            this.data.error = 'System problem.  Please contact administrator.';
            console.log('System problem.  Please contact administrator-JoinUs-002');
          }
        )
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
                      console.log('System problem.  Please contact administrator-JoinUs-005');
                    }
                  },
                  error => {
                    this.data.error = 'System problem.  Please contact administrator.';
                    console.log('System problem.  Please contact administrator-JoinUs-006');
                  }
                )
  }
}
