import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { PasswordValidator } from './../../validators/password.validator';
import { ShareProvider } from "../../services/share";
import { Http } from "@angular/http";


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editProfileForm: FormGroup;
  matching_passwords_group: FormGroup;

  constructor(public formBuilder: FormBuilder, private http: Http, private shareProvider: ShareProvider, public navCtrl: NavController) {
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


  changePassword() {
    
  }

}
