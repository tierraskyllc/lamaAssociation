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
import { PasswordValidator } from './../../validators/password.validator';

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
      /*email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          //Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),*/
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)]))
    });
  }

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    password: [
      { type: "required", message: "Password is required." },
      { type: "minlength", message: "Enter a valid password." },
      { type: "maxlength", message: "Enter a valid password." }
    ]
  };

  //

  login() {
    this.data.error = '';
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = JSON.parse(
        '{"sessionid":"", "username":"", "firstname":"" , "lastname":""}'
      );
      body.append("username", this.loginForm.controls.email.value);
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
              this.shareProvider.curentpage = "ApplicationPage";
              this.navCtrl.push("ApplicationPage")
            } else if (decoded_response[0] == false) {
              this.data.error = decoded_response[2];
            } else {
              this.data.error = decoded_response[1];
            }
          },
          error => {
            this.data.error = error;
            //console.log("Oooops!");
          }
        );
    }
    else {
      if((!this.loginForm.get('email').dirty) || (!this.loginForm.get('password').dirty)) {
        this.data.error = 'Please enter Email and Password.';
      }
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

  chapterAdminPage() {
    this.navCtrl.push("ChapterAdminPage")
  }

  signUpSuccessPage() {
    this.navCtrl.push("SignUpSuccessPage")
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }
}

