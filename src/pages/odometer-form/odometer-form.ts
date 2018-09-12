import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, ToastController, Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { File } from "@ionic-native/file";
import { ShareProvider } from "../../services/share";

@IonicPage()
@Component({
  selector: "page-odometer-form",
  templateUrl: "odometer-form.html"
})
export class OdometerFormPage {
  odometerUpdateForm: FormGroup;
  submitAttempt: boolean = false;

  data: any = {};
  lastImageFullPath: string = "";
  lastImage: string = "";

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    private file: File,
    private shareProvider: ShareProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad OdometerFormPage");
  }

  ionViewWillLoad() {
    this.odometerUpdateForm = this.formBuilder.group({
      mileageUpdate: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      motorcycles: this.formBuilder.array([this.getInitialMotorcycle()]),
      licenseExpirationDate: ["", Validators.compose([Validators.required])],
      insuranceExpirationDate: ["", Validators.compose([Validators.required])],
      registrationExpirationDate: ["", Validators.compose([Validators.required])],

    });
  }

  validation_messages = {
    'licenseExpirationDate': [{ type: 'required', message: 'Expiration Date is required.'}],
    'insuranceExpirationDate': [{ type: 'required', message: 'Expiration Date is required.'}],
    'registrationExpirationDate': [{ type: 'required', message: 'Expiration Date is required.'}],
  }

  getInitialMotorcycle() {
    return this.formBuilder.group({
      color: [""],
      year: [""],
      make: [""],
      model: [""],
      licensePlate: [""],
      currentMileage: [""],
      odometerPic: [""],
      odometerPicURL: [""],
      registrationPic: [""],
      registrationPicURL: [""]
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
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
    this.camera.getPicture(options).then(
      imagePath => {
        // Special handling for Android library
        if (
          this.platform.is("android") &&
          sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
        ) {
          this.filePath.resolveNativePath(imagePath).then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
            let currentName = imagePath.substring(
              imagePath.lastIndexOf("/") + 1,
              imagePath.lastIndexOf("?")
            );
            this.copyFileToLocalDir(
              correctPath,
              currentName,
              this.createFileName()
            );
            this.lastImageFullPath = correctPath + currentName;
          });
        } else {
          //this.presentMessageOnlyAlert('checkpoint-1');
          //this.presentMessageOnlyAlert(imagePath);
          var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
          //this.presentMessageOnlyAlert('checkpoint-2');
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
          //this.presentMessageOnlyAlert('checkpoint-3');
          //this.presentMessageOnlyAlert(correctPath);
          //this.presentMessageOnlyAlert(currentName);
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
          //this.presentMessageOnlyAlert('checkpoint-4');
          this.lastImageFullPath = imagePath;
        }
        //this.uploadImage();
      },
      err => {
        this.presentToast("Error while selecting image." + err);
      }
    );
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =
        this.shareProvider.username +
        "_" +
        this.data.selectedimage +
        "_" +
        n +
        ".jpg";
    if (this.data.selectedimage == "license") {
      this.data.licensepic = newFileName;
    } else if (this.data.selectedimage == "insurance") {
      this.data.insurancepic = newFileName;
    }
    // rafael
    // else {
    //   var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    //   for (var i = 0; i < motorcyclesobjects.length; i++) {
    //     if(this.data.selectedimage == 'odometer'+i) {
    //       var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    //       motorcyclesobjects[i]['odometerPic'] = newFileName;
    //       break;
    //     }
    //     if(this.data.selectedimage == 'registration'+i) {
    //       var motorcyclesobjects = this.applicationForm.controls['motorcycles'].value;
    //       motorcyclesobjects[i]['registrationPic'] = newFileName;
    //       break;
    //     }
    //   }
    // }
    //this.presentMessageOnlyAlert(newFileName);
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    //this.presentMessageOnlyAlert(this.file.dataDirectory);
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          this.lastImage = newFileName;
        },
        error => {
          this.lastImage = newFileName;
          //this.presentToast('Error while storing file.');
          console.log(
            "Error while storing file.  This error can be safely ignored."
          );
        }
      );
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 10000,
      position: "top"
    });
    toast.present();
  }

  public uploadLicense() {
    this.data.selectedimage = "license";
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadOdometer(num) {
    this.data.selectedimage = "odometer"+num;
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadInsurance() {
    this.data.selectedimage = "insurance";
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public uploadRegistration(num) {
    this.data.selectedimage = "registration"+num;
    //this.presentActionSheet();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
