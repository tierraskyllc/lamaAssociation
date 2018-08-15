import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgeValidator } from  '../../validators/age';
import { PhoneValidator } from './../../validators/phone.validator';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the AddeventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addevent',
  templateUrl: 'addevent.html',
})
export class AddeventPage {

  events: any;
  data: any = {};

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;
  loading: Loading;

  addEventForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File, 
    private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController) {
      this.data.response = "";
      this.data.error = "";
      this.data.selectedimage = "";
      this.data.currentyear = new Date().getFullYear();
      this.data.nextyear = this.data.currentyear + 1;
  }

  validation_messages = {
    'title': [{ type: 'required', message: 'Event Title is required.' }],
    'description': [{ type: 'required', message: 'Event Description is required.' }],
    'start_dttm': [{ type: 'required', message: 'Start Date and Time is required.' }],
    'end_dttm': [{ type: 'required', message: 'End Date and Time is required.' }]
  }

  ionViewWillLoad() {
    this.addEventForm = this.formBuilder.group({
      title: ["", Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
      start_dttm: ["", Validators.compose([Validators.required])],
      end_dttm: ["", Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddeventPage');
  }

}
