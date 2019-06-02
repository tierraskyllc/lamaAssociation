import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, ModalController, NavParams } from "ionic-angular";
import { ToastService } from "../../services/toast.service";
import { ActionSheetController } from "ionic-angular";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading, Platform, ToastController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/**
 * Generated class for the ManagegaragePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-managegarage',
  templateUrl: 'managegarage.html',
})
export class ManagegaragePage {

  @ViewChild('content') content:any;

  loading: Loading;

  data: any = {};

  member = {
    name: "Name from Server",
    profileImage: "assets/images/avatar/girl-avatar.png",
    profileQrImage: "assets/images/qr-code.png",
    coverImage: "assets/images/background/background-5.jpg",
    chapter: "L.A.M.A. Newark",
    status: "Full Pathed Member",
    title: "Road Captain",
    followers: 456,
    following: 1051,
    memberSince: 2003
  };

  garageForm: FormGroup;
  newMotorcycleForm: FormGroup;
  memberMotorcycleInfo = [];

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;

  submitAttempt: boolean = false;

  constructor(
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController,
    //public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    public navParams: NavParams,
  ) {
      this.data.lama_members_id = navParams.get('lama_members_id');
      this.data.username = navParams.get('username');
      this.data.response = "";
      this.data.error = "";
      this.data.licensepic = "";
      this.data.motorcyclesobjects = [];
      this.data.minyear = new Date().getFullYear();
      this.data.maxyear = new Date().getFullYear() + 25;
      this.data.motorcycleformgroups = [];
      //this.data.isNewMotorcycleHidden = false;
  }

  ionViewWillLoad() {
    this.garageForm = this.formBuilder.group({
      licenseexpdt: ["", Validators.compose([Validators.required])]
    });
    //-----
    this.newMotorcycleForm = this.formBuilder.group({
      color: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      make: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      licensePlate: ['', Validators.compose([Validators.required])],
      currentMileage: ['', Validators.compose([Validators.required])],
      registrationexpdt: ['', Validators.compose([Validators.required])],
      insuranceexpdt: ['', Validators.compose([Validators.required])]
    })

    this.loadProfileInfo();
    
    setInterval(() => {      
      //console.log('timer');
      this.uploadImage();
      },2000);
  }

  loadProfileInfo() {
    //-----
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    body.append("lama_members_id", this.data.lama_members_id);
    body.append("username", this.data.username);
    this.http
      .post(this.shareProvider.server + "profile/userprofileinfo.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.data.lama_members_id = decoded_response[2]["lama_members_id"];
            this.garageForm.controls['licenseexpdt'].setValue(decoded_response[2]["licenseexpdt"]);
            this.data.licenseexpdt = decoded_response[2]["licenseexpdt"];
            this.data.licensepic = decoded_response[2]["licensepic"];
            this.data.license_exp_alert_msg = decoded_response[2]["license_exp_alert_msg"];
            this.loading.dismissAll();
          } else {
            if (
              decoded_response[1] == "Session Expired." ||
              decoded_response[1] == "Invalid Session."
            ) {
              this.navCtrl.push("LoginPage");
              this.loading.dismissAll();
            } else {
              this.data.error =
                "Unknown problem occured.  Please contact administrator.";
              console.log(
                "Unknown problem occured.  Please contact administrator. - G001"
              );
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error =
            "Unknown problem occured.  Please contact administrator.";
          console.log(
            "Unknown problem occured.  Please contact administrator. - G002"
          );
          this.loading.dismissAll();
        }
      );
    //-----
  }

  validation_messages = {
    'licenseexpdt': [{ type: 'required', message: 'License expiration date is required.'}]
  }

  ionViewDidLoad() {
    this.loadGarageInfo();
    console.log("ionViewDidLoad GaragePage");
  }

  loadGarageInfo() {
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();

    //-----
    var decoded_response = null;
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    body.append("lama_members_id", this.data.lama_members_id);
    body.append("username", this.data.username);
    this.http
      .post(this.shareProvider.server + "garage/usergarage.php", body)
      .subscribe(
        data => {
          console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.memberMotorcycleInfo = decoded_response[2];
            for(var i = 0; i < decoded_response[2].length; i++) {
              if(decoded_response[2][i]['registrationexpdt'] == '0000-00-00') {
                this.memberMotorcycleInfo[i]['registrationexpdt'] = null;
              }
              if(decoded_response[2][i]['insuranceexpdt'] == '0000-00-00') {
                this.memberMotorcycleInfo[i]['insuranceexpdt'] = null;
              }
              this.data.motorcycleformgroups[i] = this.formBuilder.group({
                                                    registrationexpdt: [decoded_response[2][i]['registrationexpdt'], Validators.compose([Validators.required])],
                                                    miles: [decoded_response[2][i]['miles'], Validators.compose([Validators.required])],
                                                    insuranceexpdt: [decoded_response[2][i]['insuranceexpdt'], Validators.compose([Validators.required])]
                                                  });
            }
            this.loading.dismissAll();
          } else {
            if (
              decoded_response[1] == "Session Expired." ||
              decoded_response[1] == "Invalid Session."
            ) {
              this.navCtrl.push("LoginPage");
              this.loading.dismissAll();
            } else {
              this.data.error =
                "Unknown problem occured.  Please contact administrator.";
              console.log(
                "Unknown problem occured.  Please contact administrator. - G001"
              );
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error =
            "Unknown problem occured.  Please contact administrator.";
          console.log(
            "Unknown problem occured.  Please contact administrator. - G002"
          );
          this.loading.dismissAll();
        }
      );
    //-----
  }

  addMotorcycle() {
    //if(this.data.isNewMotorcycleHidden) {
      this.data.odometerpic = '';
      this.data.registrationpic = '';
      this.data.insurancepic = '';
      this.newMotorcycleForm.controls['color'].setValue('');
      this.newMotorcycleForm.controls['year'].setValue('');
      this.newMotorcycleForm.controls['make'].setValue('');
      this.newMotorcycleForm.controls['model'].setValue('');
      this.newMotorcycleForm.controls['licensePlate'].setValue('');
      this.newMotorcycleForm.controls['currentMileage'].setValue('');
      this.newMotorcycleForm.controls['registrationexpdt'].setValue('');
      this.newMotorcycleForm.controls['insuranceexpdt'].setValue('');
      this.data.isNewMotorcycleHidden = false;
      this.content.scrollToBottom();
    //}
  }

  openGarageModal() {
    this.openModal2("OdometerFormPage");
  }

  openModal2(pageName) {
    this.modalCtrl.create(pageName).present();
  }

  openQrCodeModal() {
    this.openModal("QrCodeModalPage");
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName).present();
  }

  displayLicensePic() {
    if((this.data.licensepic == null) || (this.data.licensepic == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.data.licensepic, 'License Pic');
  }

  displayOdometerPicForNewMotorcycle() {
    if((this.data.odometerpic == null) || (this.data.odometerpic == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.data.odometerpic, 'Odometer Pic');
  }

  displayRegistrationPicForNewMotorcycle() {
    if((this.data.registrationpic == null) || (this.data.registrationpic == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.data.registrationpic, 'Registration Pic');
  }

  displayInsurancePicForNewMotorcycle() {
    if((this.data.insurancepic == null) || (this.data.insurancepic == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.data.insurancepic, 'Insurance Pic');
  }

  displayOdometerPic(i) {
    if((this.memberMotorcycleInfo[i]['odometerpic'] == null) || (this.memberMotorcycleInfo[i]['odometerpic'] == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.memberMotorcycleInfo[i]['odometerpic'], 'Odometer Pic for ' + this.memberMotorcycleInfo[i]['make'] + ' ' + this.memberMotorcycleInfo[i]['model'] + ' ' + this.memberMotorcycleInfo[i]['year']);
  }

  displayRegistrationPic(i) {
    if((this.memberMotorcycleInfo[i]['registrationpic'] == null) || (this.memberMotorcycleInfo[i]['registrationpic'] == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.memberMotorcycleInfo[i]['registrationpic'], 'Registration Pic for ' + this.memberMotorcycleInfo[i]['make'] + ' ' + this.memberMotorcycleInfo[i]['model'] + ' ' + this.memberMotorcycleInfo[i]['year']);
  }

  displayInsurancePic(i) {
    if((this.memberMotorcycleInfo[i]['insurancepic'] == null) || (this.memberMotorcycleInfo[i]['insurancepic'] == '')) {
      this.shareProvider.presentMessageOnlyAlert('You must upload picture.');
      return;
    }
    this.shareProvider.displayPic(this.memberMotorcycleInfo[i]['insurancepic'], 'Insurance Pic for ' + this.memberMotorcycleInfo[i]['make'] + ' ' + this.memberMotorcycleInfo[i]['model'] + ' ' + this.memberMotorcycleInfo[i]['year']);
  }

  public uploadLicense() {
    this.data.selectedimage = "license";
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadOdometerPic(i) {
    this.data.selectedimage = "odometer"+i;
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadOdometerPicForNewMotorcycle() {
    this.data.selectedimage = "odometer";
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadRegistrationPic(i) {
    this.data.selectedimage = "registration"+i;
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadRegistrationPicForNewMotorcycle() {
    this.data.selectedimage = "registration";
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadInsurancePic(i) {
    this.data.selectedimage = "insurance"+i;
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadInsurancePicForNewMotorcycle() {
    this.data.selectedimage = "insurance";
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  submitLicense() {
    //this.shareProvider.presentMessageOnlyAlert(this.data.licensepic);
    //this.shareProvider.presentMessageOnlyAlert(this.garageForm.controls['licenseexpdt'].value);
    if(this.garageForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      body.append('expdt', this.garageForm.controls['licenseexpdt'].value);
      body.append('license_pic', this.data.licensepic);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/updateuserlicense.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully updated license information.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
    else {
      this.shareProvider.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  submitOdometerChanges(num) {
    if(!((this.data.motorcycleformgroups[num].get('miles').hasError('required')) || (this.memberMotorcycleInfo[num]['odometerpic'] == null) || (this.memberMotorcycleInfo[num]['odometerpic'] == ''))) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      body.append('miles', this.data.motorcycleformgroups[num].get('miles').value);
      body.append('odometerpic', this.memberMotorcycleInfo[num]['odometerpic'])
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/updateusermiles.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully updated miles information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
    else {
      this.shareProvider.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  submitRegistrationChanges(num) {
    if(!((this.data.motorcycleformgroups[num].get('registrationexpdt').hasError('required')) || (this.memberMotorcycleInfo[num]['registrationpic'] == null) || (this.memberMotorcycleInfo[num]['registrationpic'] == ''))) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      body.append('registrationexpdt', this.data.motorcycleformgroups[num].get('registrationexpdt').value);
      body.append('registrationpic', this.memberMotorcycleInfo[num]['registrationpic'])
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/updateuserregistration.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully updated registration information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-028");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-028");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-029");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-029");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
    else {
      this.shareProvider.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  submitInsuranceChanges(num) {
    if(!((this.data.motorcycleformgroups[num].get('insuranceexpdt').hasError('required')) || (this.memberMotorcycleInfo[num]['insurancepic'] == null) || (this.memberMotorcycleInfo[num]['insurancepic'] == ''))) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      body.append('insuranceexpdt', this.data.motorcycleformgroups[num].get('insuranceexpdt').value);
      body.append('insurancepic', this.memberMotorcycleInfo[num]['insurancepic'])
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/updateuserinsurance.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully updated insurance information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-038");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-038");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-039");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-039");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
    else {
      this.shareProvider.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  submitNewMotorcycle() {
    this.submitAttempt = true;
    if(this.newMotorcycleForm.valid && (this.data.odometerpic !== null) && (this.data.odometerpic !== '') && (this.data.registrationpic !== null) && (this.data.registrationpic !== '') && (this.data.insurancepic !== null) && (this.data.insurancepic !== '')) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      body.append('year', this.newMotorcycleForm.controls['year'].value);
      body.append('color', this.newMotorcycleForm.controls['color'].value);
      body.append('make', this.newMotorcycleForm.controls['make'].value);
      body.append('model', this.newMotorcycleForm.controls['model'].value);
      body.append('license_plate', this.newMotorcycleForm.controls['licensePlate'].value);
      body.append('miles', this.newMotorcycleForm.controls['currentMileage'].value);
      body.append('registrationexpdt', this.newMotorcycleForm.controls['registrationexpdt'].value);
      body.append('insuranceexpdt', this.newMotorcycleForm.controls['insuranceexpdt'].value);
      body.append('odometerpic', this.data.odometerpic);
      body.append('registrationpic', this.data.registrationpic);
      body.append('insurancepic', this.data.insurancepic);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/addnewusermotorcycle.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully submitted request to add a new motorcycle to your garage.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
            this.data.odometerpic = '';
            this.data.registrationpic = '';
            this.data.insurancepic = '';
            this.newMotorcycleForm.controls['color'].setValue('');
            this.newMotorcycleForm.controls['year'].setValue('');
            this.newMotorcycleForm.controls['make'].setValue('');
            this.newMotorcycleForm.controls['model'].setValue('');
            this.newMotorcycleForm.controls['licensePlate'].setValue('');
            this.newMotorcycleForm.controls['currentMileage'].setValue('');
            this.newMotorcycleForm.controls['registrationexpdt'].setValue('');
            this.newMotorcycleForm.controls['insuranceexpdt'].setValue('');
            this.data.isNewMotorcycleHidden = false;
            this.content.scrollToTop();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-048");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-048");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-049");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-049");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
    else {
      this.shareProvider.presentMessageOnlyAlert('Did you miss one or more required fields?');
    }
  }

  //====================================================================================

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
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        this.lastImageFullPath = imagePath;
      }
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
    else if(this.data.selectedimage == 'odometer') {
      this.data.odometerpic = newFileName;
    }
    else if(this.data.selectedimage == 'registration') {
      this.data.registrationpic = newFileName;
    }
    else {
      for (var i = 0; i < this.memberMotorcycleInfo.length; i++) {
        if(this.data.selectedimage == 'odometer'+i) {
          this.memberMotorcycleInfo[i]['odometerpic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'registration'+i) {
          this.memberMotorcycleInfo[i]['registrationpic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'insurance'+i) {
          this.memberMotorcycleInfo[i]['insurancepic'] = newFileName;
          break;
        }
      }
    }
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
    if((this.lastImage != "") && (this.lastImageFullPath != "") && (this.isUploadImageRunning != true)) {
      this.isUploadImageRunning = true;
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
        this.presentToast('Image succesfully uploaded.');
        this.lastImage = "";
        this.lastImageFullPath = "";
        this.isUploadImageRunning = false;
        //this.presentToast(this.data.licensepic);
        //this.presentToast(JSON.stringify(data));
      }, (err) => {
        this.loading.dismissAll();
        this.presentToast('Error while uploading image(s).');
        this.isUploadImageRunning = false;
        if(this.data.selectedimage == 'license') {
          this.data.licensepic = '';
          //this.presentToast(this.data.licensepic);
        }
        else if(this.data.selectedimage == 'insurance') {
          this.data.insurancepic = '';
        }
        else {
          for (var i = 0; i < this.memberMotorcycleInfo.length; i++) {
            if(this.data.selectedimage == 'odometer'+i) {
              this.memberMotorcycleInfo[i]['odometerpic'] = '';
              break;
            }
            if(this.data.selectedimage == 'registration'+i) {
              this.memberMotorcycleInfo[i]['registrationpic'] = '';
              break;
            }
            if(this.data.selectedimage == 'insurance'+i) {
              this.memberMotorcycleInfo[i]['insurancepic'] = '';
              break;
            }
          }
        }
      });
    }
  }

  approveLicense() {
    //this.shareProvider.presentMessageOnlyAlert(this.data.licensepic);
    //this.shareProvider.presentMessageOnlyAlert(this.garageForm.controls['licenseexpdt'].value);
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/approveuserlicense.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully approved license information.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }
  
  rejectLicense() {
    //this.shareProvider.presentMessageOnlyAlert(this.data.licensepic);
    //this.shareProvider.presentMessageOnlyAlert(this.garageForm.controls['licenseexpdt'].value);
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('lama_members_id', this.data.lama_members_id);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/rejectuserlicense.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully rejected license information.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-008");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-009");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  approveUserMiles(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/approveusermiles.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully approved miles information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  rejectUserMiles(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/rejectusermiles.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully rejected miles information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  approveUserRegistration(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/approveuserregistration.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully approved registration information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  rejectUserRegistration(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/rejectuserregistration.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully rejected registration information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  approveUserInsurance(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/approveuserinsurance.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully approved insurance information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  rejectUserInsurance(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/rejectuserinsurance.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully rejected insurance information for this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  approveUserMotorcycle(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/approveusermotorcycle.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully approved this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

  rejectUserMotorcycle(num) {
    if(true) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      //body.append('lama_members_id', this.data.lama_members_id);
      body.append('lama_motorcycles_id', this.memberMotorcycleInfo[num]['lama_motorcycles_id']);
      //------------------------------------------------------------------
      this.http.post(this.shareProvider.server + "garage/rejectusermotorcycle.php", body).subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.shareProvider.presentMessageOnlyAlert("You've successfully rejected this motorcycle.");
            this.loading.dismissAll();
            this.loadProfileInfo();
            this.loadGarageInfo();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            console.log("Unknown problem occured.  Please contact administrator.  Code: garage-018");
            this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          console.log("Unknown problem occured.  Please contact administrator.  Code: garage-019");
          this.loading.dismissAll();
        }
      );
      //------------------------------------------------------------------
    }
  }

}
