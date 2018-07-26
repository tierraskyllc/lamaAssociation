import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  loading: Loading;

  loginForm: FormGroup;
  data: any = {};
  submitAttempt: boolean = false;

  params: any = {};
  email: string;

  constructor(
    public formBuilder: FormBuilder,
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.data.error = navParams.get('data');
  }

  ionViewWillLoad() {
    this.loginForm = this.formBuilder.group({
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

  login() {
    this.data.error = '';
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();
      var body = new FormData();
      var json_encoded_response = "";
      //var decoded_response = JSON.parse(
      //  '{"sessionid":"", "username":"", "firstname":"" , "lastname":""}'
      //);
      body.append("username", this.loginForm.controls.email.value);
      body.append("password", this.loginForm.controls.password.value);
      this.http
        .post(this.shareProvider.server + "signin/signin.php", body)
        .subscribe(
          data => {
            //this.data.response = data["_body"];
            json_encoded_response = data["_body"];
            var decoded_response = "";
            decoded_response = JSON.parse(json_encoded_response);
            if (decoded_response[0] == "true") {
              this.shareProvider.sessionid = decoded_response[2];
              this.shareProvider.username = decoded_response[3];
              this.shareProvider.firstname = decoded_response[4];
              this.shareProvider.lastname = decoded_response[5];
              if (decoded_response[6] != null) {
                this.shareProvider.role = decoded_response[6];
              }
              //-----
              decoded_response = "";
              var body = new FormData();
              body.append('sessionid', this.shareProvider.sessionid);
              this.http
                .post(this.shareProvider.server + "profile/profile.php", body)
                .subscribe(
                  data => {
                    decoded_response = JSON.parse(data["_body"]);
                    //console.log(data["_body"]);
                    if (decoded_response[0] == "true") {
                      if(decoded_response[2]['is_member_approved'] == 0) {
                        this.navCtrl.push("ApplicationPage");
                        this.shareProvider.curentpage = "ApplicationPage";
                        this.loading.dismissAll();
                      }
                      else {
                        if(decoded_response[2]['is_member_approved'] == 1) {
                          this.navCtrl.push("ProfilePage");
                          this.shareProvider.curentpage = "ProfilePage";
                        }
                        this.loading.dismissAll();
                      }
                    }
                    else {
                      if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
                        this.navCtrl.push('LoginPage');
                        this.loading.dismissAll();
                      }
                      else {
                        this.data.error = "Unknown problem occured.  Please contact administrator.";
                        console.log("Unknown problem occured.  Please contact administrator. - L001");
                        this.loading.dismissAll();
                      }
                    }
                  },
                  error => {
                    this.data.error = "Unknown problem occured.  Please contact administrator.";
                    console.log("Unknown problem occured.  Please contact administrator. - L002");
                    this.loading.dismissAll();
                  }
                );
              //-----  
              //this.navCtrl.push("ApplicationPage")
            } else if (decoded_response[0] == "false") {
              this.data.error = decoded_response[2];
              console.log(decoded_response[2]);
              this.loading.dismissAll();
            } else {
              this.data.error = decoded_response[1];
              console.log(decoded_response[1]);
              this.loading.dismissAll();
            }
          },
          error => {
            this.data.error = error;
            this.loading.dismissAll();
            //console.log("Oooops!");
          }
        );
    }
    else {
      if((!this.loginForm.get('email').dirty) || (!this.loginForm.get('password').dirty)) {
        this.data.error = 'Please enter Email and Password.';
      }
      //this.loading.dismissAll();
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

