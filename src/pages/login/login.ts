import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray
} from "@angular/forms";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  data: any = {};
  submitAttempt: boolean = false;

  params: any = {};
  email: string;

  constructor(
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController
  ) {}

  ionViewWillLoad() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}")
        ])
      ]
    });
  }

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    password: [
      { type: "required", message: "Password is required." },
      { type: "pattern", message: "Enter a valid password." }
    ]
  };

  //

  login() {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = JSON.parse(
        '{"sessionid":"", "username":"", "firstname":"" , "lastname":""}'
      );
      body.append("username", this.loginForm.controls.username.value);
      body.append("password", this.loginForm.controls.password.value);
      this.http
        .post(this.shareProvider.server + "signin/signin.php", body)
        .subscribe(
          data => {
            //this.data.response = data["_body"];
            json_encoded_response = data["_body"];
            decoded_response = JSON.parse(json_encoded_response);
            if (decoded_response[0] == true) {
              this.shareProvider.sessionid = decoded_response[2];
              this.shareProvider.username = decoded_response[3];
              this.shareProvider.firstname = decoded_response[4];
              this.shareProvider.lastname = decoded_response[5];
              if (decoded_response[6] != null) {
                this.shareProvider.role = decoded_response[6];
              }
              this.shareProvider.curentpage = "ProfilePage";
            } else if (decoded_response[0] == false) {
              this.data.error = decoded_response[2];
            } else {
              this.data.error = decoded_response[1];
            }
          },
          error => {
            this.data.error = error;
            console.log("Oooops!");
          }
        );
    }
  }
  //
  onEvent() {
    console.log("A Social media button was pressed");
  }

  joinUsPage() {
    this.navCtrl.push("JoinUsPage");
  }

  profilePage() {
    this.navCtrl.push("ProfilePage")
  }

  applicationPage() {
    this.navCtrl.push("ApplicationPage")
  }

  eventsPage() {
    this.navCtrl.push("EventsPage")
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }
}
