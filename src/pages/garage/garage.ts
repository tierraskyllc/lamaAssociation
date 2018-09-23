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
              this.data.motorcycleformgroups[i] = this.formBuilder.group({
                                                    registrationexpdt: [decoded_response[2][i]['registrationexpdt']],
                                                    miles: [decoded_response[2][i]['miles']],
                                                    insuranceexpdt: [decoded_response[2][i]['insuranceexpdt']],
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

  public uploadLicense() {
    this.data.selectedimage = "license";
    //this.presentActionSheet();
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
      //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
      for (var i = 0; i < this.memberMotorcycleInfo.length; i++) {
        if(this.data.selectedimage == 'odometer'+i) {
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['odometerPic'] = newFileName;
          this.memberMotorcycleInfo[i]['odometerPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'registration'+i) {
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['registrationPic'] = newFileName;
          this.memberMotorcycleInfo[i]['registrationPic'] = newFileName;
          break;
        }
        if(this.data.selectedimage == 'insurance'+i) {
          //var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
          ////motorcyclesobjects[i]['insurancePic'] = newFileName;
          this.memberMotorcycleInfo[i]['insurancePic'] = newFileName;
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

}
