import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { PasswordValidator } from './../../validators/password.validator';

@IonicPage()
@Component({
  selector: "page-joinus",
  templateUrl: "joinus.html"
})
export class JoinUsPage {

  joinUsForm: FormGroup;
  matching_passwords_group: FormGroup;
  data: any = {};

  submitAttempt: boolean = false;

  params: any = {};
  email: string;

  constructor(public formBuilder: FormBuilder, private http: Http, private shareProvider: ShareProvider) {
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

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.minLength(5), Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])),
      confirm_password: new FormControl('', Validators.required)},
      (formGroup: FormGroup) => {return PasswordValidator.areEqual(formGroup);
    });

    this.joinUsForm = this.formBuilder.group({
      firstName: ["", Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern("[a-zA-Z ]*")])],
      lastName: ["", Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern("[a-zA-Z ]*")])],
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      matching_passwords: this.matching_passwords_group,
      selection: ["", Validators.compose([Validators.required])],
      region: ["", Validators.compose([Validators.required])],
      state: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      chapter: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      country: ["", Validators.compose([Validators.required])],
      intlchapter: ["", Validators.compose([Validators.required])]
    });



  }

  validation_messages = {
    'firstName': [{ type: "required", message: "First Name is required." }],
    lastName: [{ type: "required", message: "Last Name is required." }],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
  };

  selectNational() {
    this.data.nationalSelected = true;
    this.data.intlSelected = false;
    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  selectInternational() {
    this.data.intlSelected = true;
    this.data.nationalSelected = false;
    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  submit() {
    this.submitAttempt = true;
    if (this.joinUsForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append("email", this.joinUsForm.controls.email.value);
      body.append("firstName", this.joinUsForm.controls.firstname.value);
      body.append("lastName", this.joinUsForm.controls.lastname.value);
      body.append("password", this.joinUsForm.controls.password.value);
      body.append("selection", this.joinUsForm.controls.selection.value);
      body.append("chapter", this.joinUsForm.controls.chapter.value);
      body.append(
        "intlchapter",
        this.joinUsForm.controls.intlchapter.value
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
    this.joinUsForm.patchValue({ state: "", chapter: "" });
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

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateUSAStatesByRegion() {
    this.joinUsForm.patchValue({ state: "", chapter: "" });
    this.data.usachapters = [];
    var decoded_response = "";
    var body = new FormData();
    var regionid = this.joinUsForm.controls.region.value;
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

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateUSAChaptersByState() {
    this.joinUsForm.patchValue({ chapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var stateid = this.joinUsForm.controls.state.value;
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

    this.joinUsForm.get("country").setValidators([]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm.get("intlchapter").setValidators([]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([Validators.required]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm
      .get("state")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm
      .get("chapter")
      .setValidators([Validators.required, Validators.minLength(1)]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateCountries() {
    this.joinUsForm.patchValue({ country: "", intlchapter: "" });
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

    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  populateIntlChaptersByReg() {
    this.joinUsForm.patchValue({ intlchapter: "" });
    var decoded_response = "";
    var body = new FormData();
    var countryid = this.joinUsForm.controls.country.value;
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

    this.joinUsForm.get("country").setValidators([Validators.required]);
    this.joinUsForm.get("country").updateValueAndValidity();
    this.joinUsForm
      .get("intlchapter")
      .setValidators([Validators.required]);
    this.joinUsForm.get("intlchapter").updateValueAndValidity();
    this.joinUsForm.get("region").setValidators([]);
    this.joinUsForm.get("region").updateValueAndValidity();
    this.joinUsForm.get("state").setValidators([]);
    this.joinUsForm.get("state").updateValueAndValidity();
    this.joinUsForm.get("chapter").setValidators([]);
    this.joinUsForm.get("chapter").updateValueAndValidity();
  }

  ionViewDidLoad() {
    this.populateUSARegions();
    this.populateCountries();
    console.log("ionViewDidLoad JoinUsPage");
  }
}
