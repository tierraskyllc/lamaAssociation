import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";
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

@IonicPage()
@Component({
  selector: "page-garage",
  templateUrl: "garage.html"
})
export class GaragePage {
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

  memberMotorcycleInfo = [];

  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;

  submitAttempt: boolean = false;

  constructor(
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    public toastCtrl1: ToastController,
    private transfer: FileTransfer
  ) {
      this.data.response = "";
      this.data.error = "";
      this.data.licensepic = "";
      this.data.motorcyclesobjects = [];
      this.data.maxyear = new Date().getFullYear() + 25;
      this.data.motorcycleformgroups = [];
  }

  ionViewWillLoad() {
    this.garageForm = this.formBuilder.group({
      licenseexpdt: ["", Validators.compose([Validators.required])],
      motorcycles: this.formBuilder.array([this.getInitialMotorcycle()])
    });
    //-----
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "profile/profileinfo.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.garageForm.controls['licenseexpdt'].setValue(decoded_response[2]["licenseexpdt"]);
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
    setInterval(() => {      
      //console.log('timer');
      this.uploadImage();
      },2000);
  }

  validation_messages = {
    'licenseexpdt': [{ type: 'required', message: 'License expiration date is required.'}]
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();

    //-----
    var decoded_response = null;
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "garage/garage.php", body)
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
    console.log("ionViewDidLoad GaragePage");
  }

  imageTapped(post) {
    this.toastCtrl.create("Post image clicked");
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
    const control = <FormArray>this.garageForm.controls['motorcycles'];
    control.push(this.getInitialMotorcycle());
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
    this.shareProvider.displayPic(this.data.licensepic, 'License Pic');
  }

  displayOdometerPic(i) {
    this.shareProvider.displayPic(this.memberMotorcycleInfo[i]['odometerpic'], 'Odometer Pic for ' + this.memberMotorcycleInfo[i]['make'] + ' ' + this.memberMotorcycleInfo[i]['model'] + ' ' + this.memberMotorcycleInfo[i]['year']);
  }

  displayRegistrationPic(i) {
    this.shareProvider.displayPic(this.memberMotorcycleInfo[i]['registrationpic'], 'Registration Pic for ' + this.memberMotorcycleInfo[i]['make'] + ' ' + this.memberMotorcycleInfo[i]['model'] + ' ' + this.memberMotorcycleInfo[i]['year']);
  }

  displayInsurancePic(i) {
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

  public uploadRegistrationPic(i) {
    this.data.selectedimage = "registration"+i;
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadInsurancePic(i) {
    this.data.selectedimage = "insurance"+i;
    this.takePicture(this.camera.PictureSourceType.CAMERA);
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
    let toast = this.toastCtrl1.create({
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
        this.presentToast('Image succesful uploaded.');
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

}
