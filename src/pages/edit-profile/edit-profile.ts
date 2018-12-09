import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { PasswordValidator } from './../../validators/password.validator';
import { ShareProvider } from "../../services/share";
import { Http } from "@angular/http";
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  data: any = {};
  submitAttempt: boolean = false;
  editProfileForm: FormGroup;
  matching_passwords_group: FormGroup;

  constructor(public formBuilder: FormBuilder, 
              private http: Http, 
              private shareProvider: ShareProvider, 
              public navCtrl: NavController, 
              private alertCtrl: AlertController) 
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  ionViewWillLoad() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,16}')])),
      confirm_password: new FormControl('', Validators.required)},
      (formGroup: FormGroup) => {return PasswordValidator.areEqual(formGroup);
    });

    this.editProfileForm = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group
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
  };

  submit() {
    this.submitAttempt = true;
    if (this.editProfileForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append("password", this.matching_passwords_group.controls.password.value);
      this.http
        .post(this.shareProvider.server + "profile/changepasswd.php", body)
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

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

}
