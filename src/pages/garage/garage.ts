import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";
import { ToastService } from "../../services/toast.service";
import { ActionSheetController } from "ionic-angular";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

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

  constructor(
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
  ) {
      this.data.response = "";
      this.data.error = "";
      this.data.motorcyclesobjects = [];
  }

  ionViewWillLoad() {
    this.garageForm = this.formBuilder.group({
      motorcycles: this.formBuilder.array([this.getInitialMotorcycle()])
    });
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
}
