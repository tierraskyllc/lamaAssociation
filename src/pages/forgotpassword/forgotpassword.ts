import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { PasswordValidator } from './../../validators/password.validator';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  data: any = {};
  loading: Loading;
  memberForm: FormGroup;
  changePasswordForm: FormGroup;
  matching_passwords_group: FormGroup;
  emailMask = emailMask;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.data.response = "";
    this.data.error = "";
  }

  ionViewDidLoad() {
    this.getCaptcha();
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  ionViewWillLoad() {
    this.createSignUpSession();
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,16}')])),
      confirm_password: new FormControl('', Validators.required)},
      (formGroup: FormGroup) => {return PasswordValidator.areEqual(formGroup);
    });
    this.changePasswordForm = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group,
    });

    this.memberForm = this.formBuilder.group({
      first_name: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      last_name: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern("[a-zA-Z0-9 \.\']*")])],
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      city: ['', Validators.compose([Validators.required])],
      dateofbirth: ["", Validators.compose([Validators.required])],
      placeOfBirth: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      captcha_text: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("[a-zA-Z0-9]+")])]
    });
  }

  validation_messages = {
    'first_name': [{ type: "required", message: "First Name is required." }, { type: "pattern", message: "Enter a valid First Name." }],
    'last_name': [{ type: "required", message: "Last Name is required." }, { type: "pattern", message: "Enter a valid Last Name." }],
    'email': [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    'city': [{type: 'required', message: 'City is required.'}, {type: 'pattern', message: 'City is invalid.'}],
    'dateofbirth': [{ type: 'required', message: 'Date of Birth is required.'}],
    'placeOfBirth': [{type: 'required', message: 'Place of Birth is required.'}, {type: 'pattern', message: 'Place of birth is invalid.'}],
    'captcha_text': [
      { type: "required", message: "Please enter text displayed in picture above." },
      { type: "pattern", message: "Text you entered is not valid." }
    ],
    'password': [{ type: "required", message: "Please enter new password." }],
    'confirm_password': [{ type: "required", message: "Please confirm new password."}]
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
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

  createSignUpSession() {
    var json_encoded_response = '';
    var decoded_response = '';
    var body = new FormData();
    this.http
        .post(this.shareProvider.server + "signup/start_signup.php", body)
        .subscribe(
          data => {
            json_encoded_response = data["_body"];
            //console.log(json_encoded_response);
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

  changePassword() {
    this.submitAttempt = true;
    if(this.memberForm.valid && this.changePasswordForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      //console.log(this.shareProvider.sessionid);
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('captcha_text', this.memberForm.controls.captcha_text.value);
      body.append('first_name', this.memberForm.controls.first_name.value);
      body.append('last_name', this.memberForm.controls.last_name.value);
      body.append('email', this.memberForm.controls.email.value);
      body.append('city', this.memberForm.controls.city.value);
      body.append('dateofbirth', this.memberForm.controls.dateofbirth.value);
      body.append('placeOfBirth', this.memberForm.controls.placeOfBirth.value);
      body.append("password", this.matching_passwords_group.controls.password.value);
      this.http
        .post(this.shareProvider.server + "signin/changepasswd.php", body)
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
    else {
      this.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

}
