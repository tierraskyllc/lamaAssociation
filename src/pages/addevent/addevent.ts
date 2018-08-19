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

  submitAttempt: boolean = false;

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
      this.data.countries = [];
      this.data.usastates = [];
      this.data.usacities = [];
      this.data.mychapters = [];
  }

  validation_messages = {
    'chapter': [{ type: 'required', message: 'Chapter is required.' }],
    'title': [{ type: 'required', message: 'Event Title is required.' }],
    'description': [{ type: 'required', message: 'Event Description is required.' }],
    'start_dttm': [{ type: 'required', message: 'Start Date and Time is required.' }],
    'end_dttm': [{ type: 'required', message: 'End Date and Time is required.' }],
    'venue_country': [{ type: 'required', message: 'Country is required.' }],
    'venue_usa_state': [{ type: 'required', message: 'State is required.' }],
    'venue_state': [{ type: 'required', message: 'State is required.' }],
    'venue_usa_city': [{ type: 'required', message: 'City is required.' }],
    'venue_city': [{ type: 'required', message: 'City is required.' }],
    'venue_address': [{ type: 'required', message: 'Address is required.' }],
    'venue_zipcode': [{ type: 'required', message: 'Zipcode is required.' }],
    'additional_info': [{ type: 'required', message: 'Additional Information is required.' }]
  }

  ionViewWillLoad() {
    this.addEventForm = this.formBuilder.group({
      chapter: ["", Validators.compose([Validators.required])],
      title: ["", Validators.compose([Validators.required])],
      description: [""],
      start_dttm: ["", Validators.compose([Validators.required])],
      end_dttm: ["", Validators.compose([Validators.required])],
      venue_country: ["", Validators.compose([Validators.required])],
      venue_usa_state: ["", Validators.compose([Validators.required])],
      venue_state: ["", Validators.compose([Validators.required])],
      venue_usa_city: ["", Validators.compose([Validators.required])],
      venue_city: ["", Validators.compose([Validators.required])],
      venue_address: ["", Validators.compose([Validators.required])],
      venue_zipcode: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      additional_info: [""]
    });
    this.populateChaptersManagedByMe();
    this.data.countries = ['United States'];
    this.populateCountries();
    this.populateUSAStates();

    setInterval(() => {      
      //console.log('timer');
      this.uploadImage();
      },2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddeventPage');
  }

  correctStateAndCityValidationsForVenueState() {
    //console.log(this.addEventForm.controls.venue_country.value);
    if(this.addEventForm.controls.venue_country.value == 'United States') {
      //console.log(this.addEventForm.controls.venue_country.value);
      this.addEventForm.controls.venue_state.setValue('');
      this.addEventForm.controls.venue_city.setValue('');
      this.addEventForm.controls.venue_state.setValidators([]);
      this.addEventForm.controls.venue_city.setValidators([]);
      this.addEventForm.controls.venue_usa_state.setValidators([Validators.required]);
      this.addEventForm.controls.venue_usa_city.setValidators([Validators.required]);
    }
    else {
      this.addEventForm.controls.venue_usa_state.setValue('');
      this.addEventForm.controls.venue_usa_city.setValue('');
      this.addEventForm.controls.venue_usa_state.setValidators([]);
      this.addEventForm.controls.venue_usa_city.setValidators([]);
      this.addEventForm.controls.venue_state.setValidators([Validators.required]);
      this.addEventForm.controls.venue_city.setValidators([Validators.required]);
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
                this.data.countries.push(decoded_response[2][i]['name']);
              }
            }
            catch(Error) {
              //console.log("Oooops!");
              //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-003");
              console.log("Failed to add country code " + decoded_response[2][i]['code'] + " => Unknown problem occured.  Please contact administrator.  Code: AE-003");
            }
          }
          //this.loading.dismissAll();
        }
        else {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-004");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-004");
          //this.loading.dismissAll();
        }
      },
      error => {
        //this.data.error = "Unknown problem occured.  Please contact administrator.";
        //console.log("Oooops!");
        //this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-005");
        console.log("Unknown problem occured.  Please contact administrator.  Code: AE-005");
        //this.loading.dismissAll();
      }
    );
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
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-006");
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
    body.append('usastate', this.addEventForm.controls['venue_usa_state'].value);
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
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-007");
          this.loading.dismissAll();
        }
      );
  }

  populateChaptersManagedByMe() {
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "events/chaptersmanagedbyme.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.mychapters = decoded_response[2];
          }
        },
        error => {
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-008");
        }
      );
  }

  request() {
    this.submitAttempt = true;
    this.correctStateAndCityValidationsForVenueState();
    if(this.addEventForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_chapters_id', this.addEventForm.controls.chapter.value);
      body.append('title', this.addEventForm.controls.title.value);
      body.append('description', this.addEventForm.controls.description.value);
      body.append('start_dttm', this.addEventForm.controls.start_dttm.value);
      body.append('end_dttm', this.addEventForm.controls.end_dttm.value);
      body.append('venue_country', this.addEventForm.controls.venue_country.value);
      body.append('venue_usa_state', this.addEventForm.controls.venue_usa_state.value);
      body.append('venue_state', this.addEventForm.controls.venue_state.value);
      body.append('venue_usa_city', this.addEventForm.controls.venue_usa_city.value);
      body.append('venue_city', this.addEventForm.controls.venue_city.value);
      body.append('venue_address', this.addEventForm.controls.venue_address.value);
      body.append('venue_zipcode', this.addEventForm.controls.venue_zipcode.value);
      body.append('additional_info', this.addEventForm.controls.additional_info.value);
      this.http.post(this.shareProvider.server + "events/addevent.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.presentMessageOnlyAlert("You've successfully submitted your request for event.");
            this.data.isappsubmited = true;
            //this.data.submittedtext = "Thank you for submitting your application with L.A.M.A.  You'll hear back from us soon.";
            this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: AE-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: AE-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: AE-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: AE-009");
          this.loading.dismissAll();
        }
      );
    }
    else {
      this.presentMessageOnlyAlert('Did you miss one or more required fields?');
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
      var motorcyclesobjects = this.addEventForm.controls['motorcycles'].value;
      for (var i = 0; i < motorcyclesobjects.length; i++) {
        if(this.data.selectedimage == 'odometer'+i) {
          var motorcyclesobjects = this.addEventForm.controls['motorcycles'].value;
          motorcyclesobjects[i]['odometerPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'registration'+i) {
          var motorcyclesobjects = this.addEventForm.controls['motorcycles'].value;
          motorcyclesobjects[i]['registrationPic'] = newFileName;
          break;
        }
      }
    }
    //this.presentMessageOnlyAlert(newFileName);
    return newFileName;
  }

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
          //////////this.displayOdometerPic(num);
        }
        else if(/^registration[0-9]+$/.test(this.data.selectedimage)) {
          //console.log(this.data.selectedimage);
          var num = this.data.selectedimage.match(/^registration([0-9]+)$/)[1];
          //console.log(num);
          //////////this.displayRegistrationPic(num);
        }
        else if(this.data.selectedimage == 'license') {
          //////////this.displayLicensePic();
        }
        else if(this.data.selectedimage == 'insurance') {
          //////////this.displayInsurancePic();
        }
      }, (err) => {
        this.loading.dismissAll();
        this.presentToast('Error while uploading image(s).');
        this.isUploadImageRunning = false;
      });
    }
  }

  public uploadPic() {
    this.data.selectedimage = "pic";
    this.presentActionSheet();
    //this.takePicture(this.camera.PictureSourceType.CAMERA);
  }


}
