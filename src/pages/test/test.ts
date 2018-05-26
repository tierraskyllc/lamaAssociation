import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";
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
  selector: "page-test",
  templateUrl: "test.html"
})
export class TestPage {
  data: any = {};
  registrationForm: FormGroup;
  submitAttempt: boolean = false;

  params: any = {};
  email: string;

  constructor(public formBuilder: FormBuilder,private http: Http,private shareProvider: ShareProvider) {
    this.data.response = "";
    this.data.error = "";

    this.data.nationalSelected = false;
    this.data.intlSelected = false;
    this.data.usaregions = [];
    this.data.usastates = [];
    this.data.usachapters = [];
    this.data.countries = [];
    this.data.intlchapters = [];

  }

  ionViewWillLoad() {
    this.registrationForm = this.formBuilder.group({
      firstName: ["", Validators.compose([Validators.required,Validators.maxLength(16),Validators.pattern("[a-zA-Z ]*")])],
      lastName: ["",Validators.compose([Validators.required,Validators.maxLength(16),Validators.pattern("[a-zA-Z ]*")])],
      email: new FormControl("",Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      password: ["",Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(16),Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}")])],
      confirmPassword: ["", Validators.required],
      selection: ["", Validators.compose([Validators.required])],
      region: ['', Validators.compose([Validators.required])],
 		  state: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
 		  chapter: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      country: ['', Validators.compose([Validators.required])],
      intlchapter: ['', Validators.compose([Validators.required])]

    });
  }

  validation_messages = {
    firstName: [{ type: "required", message: "First Name is required." }],
    lastName: [{ type: "required", message: "Last Name is required." }],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    password: [
      { type: "required", message: "Password is required." },
      { type: "pattern", message: "Enter a valid password." }
    ],
    confirmPassword: [
      { type: "required", message: "Confirmation is required." }
    ]
  };

  selectNational() {
    this.data.nationalSelected = true;
    this.data.intlSelected = false;
    this.registrationForm.get("country").setValidators([]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm.get("intlchapter").setValidators([]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([Validators.required]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  selectInternational() {
    this.data.intlSelected = true;
    this.data.nationalSelected = false;
    this.registrationForm.get("country").setValidators([Validators.required]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm.get("state").setValidators([]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm.get("chapter").setValidators([]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  submit() {
    this.submitAttempt = true;
    if (this.registrationForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append("email", this.registrationForm.controls.email.value);
      body.append("firstName", this.registrationForm.controls.firstname.value);
      body.append("lastName", this.registrationForm.controls.lastname.value);
      body.append("password", this.registrationForm.controls.password.value);
      body.append("selection", this.registrationForm.controls.selection.value);
      body.append("chapter", this.registrationForm.controls.chapter.value);
      body.append(
        "intlchapter",
        this.registrationForm.controls.intlchapter.value
      );
      this.http
        .post(this.shareProvider.server + "signup/signup.php", body)
        .subscribe(
          data => {
            json_encoded_response = data["_body"];
            decoded_response = JSON.parse(json_encoded_response);
            if (decoded_response[0] === "error") {
              this.data.error = decoded_response[1];
            } else {
              if (decoded_response[0]) {
                this.shareProvider.curentpage = "SignupsuccessPage";
              } else if (!decoded_response[0]) {
                this.data.error = decoded_response[2];
              } else {
                this.data.error =
                  "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
              }
            }
            /*=====
          if(decoded_response[0] == true) {
            this.shareProvider.curentpage = 'SignupsuccessPage';
          }
          else if(decoded_response[0] == false) {
            this.data.error = decoded_response[2];
          }
          else if(decoded_response[0] == "error") {
            this.data.error = decoded_response[1];
          }
          else {
            this.data.error = "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
            //console.log("Oooops!");
          }
          =====*/
          },
          error => {
            this.data.error =
              "Problem signing up for LAMA.  Please check your internet connection.  Contact administrator if problem persists.";
            //console.log("Oooops!");
          }
        );
    }
  }

  populateUSARegions() {
    this.registrationForm.patchValue({ state: "", chapter: "" });
    this.data.usastates = [];
    this.data.usachapters = [];
    var decoded_response = "";
    var body = new FormData();
    this.http
      .post(this.shareProvider.server + "usaregions.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usaregions = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.registrationForm.get("country").setValidators([]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm.get("intlchapter").setValidators([]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([Validators.required]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  populateUSAStatesByRegion() {
    this.registrationForm.patchValue({ state: "", chapter: "" });
    this.data.usachapters = [];
    var decoded_response = "";
    var body = new FormData();
    var regionid = this.registrationForm.controls.region.value;
    body.append("regionid", regionid);
    this.http
      .post(this.shareProvider.server + "usastatesbyregion.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usastates = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.registrationForm.get("country").setValidators([]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm.get("intlchapter").setValidators([]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([Validators.required]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  populateUSAChaptersByState() {
    this.registrationForm.patchValue({ chapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var stateid = this.registrationForm.controls.state.value;
    body.append("stateid", stateid);
    this.http
      .post(this.shareProvider.server + "usachaptersbystate.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.usachapters = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.registrationForm.get("country").setValidators([]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm.get("intlchapter").setValidators([]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([Validators.required]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  populateCountries() {
    this.registrationForm.patchValue({ country: "", intlchapter: "" });
    this.data.intlchapters = [];
    var decoded_response = "";
    var body = new FormData();
    this.http.post(this.shareProvider.server + "countries.php", body).subscribe(
      data => {
        //this.data.response = 'Response: ' + data["_body"];
        decoded_response = JSON.parse(data["_body"]);
        if (decoded_response[0]) {
          this.data.countries = decoded_response[2];
        }
        //this.data.countries = decoded_response;
      },
      error => {
        console.log("Oooops!");
      }
    );

    this.registrationForm.get("country").setValidators([Validators.required]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm.get("state").setValidators([]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm.get("chapter").setValidators([]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  populateIntlChaptersByReg() {
    this.registrationForm.patchValue({ intlchapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var countryid = this.registrationForm.controls.country.value;
    body.append("countryid", countryid);
    this.http
      .post(this.shareProvider.server + "intlchaptersbyreg.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0]) {
            this.data.intlchapters = decoded_response[2];
          }
        },
        error => {
          console.log("Oooops!");
        }
      );

    this.registrationForm.get("country").setValidators([Validators.required]);
    this.registrationForm.get("country").updateValueAndValidity();
    this.registrationForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.registrationForm.get("intlchapter").updateValueAndValidity();
    this.registrationForm.get("region").setValidators([]);
    this.registrationForm.get("region").updateValueAndValidity();
    this.registrationForm.get("state").setValidators([]);
    this.registrationForm.get("state").updateValueAndValidity();
    this.registrationForm.get("chapter").setValidators([]);
    this.registrationForm.get("chapter").updateValueAndValidity();
  }

  ionViewDidLoad() {
    this.populateUSARegions();
    this.populateCountries();
    console.log("ionViewDidLoad TestPage");
  }
}
