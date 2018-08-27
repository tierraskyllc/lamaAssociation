import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController} from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-odometer-form",
  templateUrl: "odometer-form.html"
})
export class OdometerFormPage {
  odometerUpdateForm: FormGroup;


  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad OdometerFormPage");
  }


  ionViewWillLoad() {
    this.odometerUpdateForm = this.formBuilder.group({
      mileageUpdate: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      motorcycles: this.formBuilder.array([
        this.getInitialMotorcycle()
      ])
    })
  }

  getInitialMotorcycle() {
    return this.formBuilder.group({
      color: [''],
      year: [''],
      make: [''],
      model: [''],
      licensePlate: [''],
      currentMileage: [''],
      odometerPic: [''],
      odometerPicURL: [''],
      registrationPic: [''],
      registrationPicURL: ['']
    });
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
