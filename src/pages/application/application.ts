import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray
} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-application',
  templateUrl: 'application.html',
})
export class ApplicationPage {
  applicationForm:FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewWillLoad() {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplicationPage');
  }

}
