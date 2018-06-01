import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AgeValidator } from  '../../validators/age';

import { PhoneValidator } from './../../validators/phone.validator';
import { Country } from './application.model';

import emailMask from 'text-mask-addons/dist/emailMask';

@IonicPage()
@Component({
  selector: 'page-application',
  templateUrl: 'application.html',
})
export class ApplicationPage {

  events: any;
  data: any;

  mockMember = {
    firstName : "John",
    lastName : "Doe",
    title: "Propect",
    chapter: "Newark",
    email: "john.doe@whatever.com"
  };

  applicationForm: FormGroup;
  country_phone_group: FormGroup;

  emailMask = emailMask;

  countries: Array<Country>;
  genders: Array<string>;
  yesOrNo: Array<string>;
  modelOfMotorcycles: Array<string>;
  maritalStatus: Array<string>;
  annualSalary: Array<string>;
  highestEducation: Array<string>;
  bloodTypes: Array<string>;
  memberTitles: Array<string>;
  typeOfMemberships: Array<string>;
  typeOfChapters: Array<string>;

  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {}

  save(){
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplicationPage');
  }

  ionViewWillLoad() {
    this.countries = [
      new Country('US', 'United States'),
      new Country('UY', 'Uruguay'),
      new Country('AR', 'Argentina')
    ];

    this.genders = ["-Select-","Male", "Female"];
    this.yesOrNo = ["-Select-","Yes", "No"];
    this.modelOfMotorcycles = ["-Select-","Harley", "Honda", "Suzuki", "Kawasaki", "BMW", "Yamaha"];
    this.maritalStatus = ["-Select-","Married", "Single", "Divorced", "Widowed" ];
    this.annualSalary = ["-Select-","Retired", "$20,000 ~ $40,000", "$50,000 ~ $70,000", "$80,000 +", "UnEmployed"];
    this.highestEducation = ["-Select-","Self Taught", "Home Schooled", "High School", "Vocational School", "College"];
    this.bloodTypes = ["-Select-","O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
    this.memberTitles = ["-Select-","No Title", "President", "Vice President", "Treasurer", "Secretary", "Business Manager", "Motor Touring Officer", "Sgt of Arms", "Road Captain", "Retired"];
    this.typeOfMemberships = ["-Select-","Full Color Member", "DAMA", "Spousal/Pareja", "Prospect", "Probate", "Associate/Asociado"];
    this.typeOfChapters = ["-Select-","Organized Chapter/Capitulo", "Establishing Chapter/Capitulo Estableciendo", "Brother Chapter/Capítulo hermano"];

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([Validators.required, PhoneValidator.validCountryPhone(country)]));

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.applicationForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      address: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      city: ['', Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      state: ['', Validators.compose([Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      zipCode: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      country_phone: this.country_phone_group,
      // gender: [(this.genders[0], Validators.required)],
      gender: new FormControl(this.genders[0], Validators.required),
      age: ['', Validators.required],
      placeOfBirth: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      yearsRiding: ['', Validators.required],
      haveMotorcycleLicense: new FormControl(this.yesOrNo[0], Validators.required),
      modelOfMotorcycle1: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      modelOfMotorcycle2: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      modelOfMotorcycle3: new FormControl(this.modelOfMotorcycles[0], Validators.required),
      licensePlate1: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      licensePlate2: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      licensePlate3: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      anyOtherClub: new FormControl(this.yesOrNo[0], Validators.required),
      nameOfOtherClub: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')])],
      maritalStatus: new FormControl(this.maritalStatus[0], Validators.required),
      numberOfChildren: ['', Validators.required],
      nameOfEmployer: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      yearsEmployed: ['', Validators.required],
      occupation: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z ]*')])],
      annualSalary: new FormControl(this.annualSalary[0], Validators.required),
      highestEducation: new FormControl(this.highestEducation[0], Validators.required),
      skillsPastimes: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')])],
      // bloodType: ['', new FormControl(this.bloodTypes[0], Validators.required)],
      bloodType: new FormControl(this.bloodTypes[0], Validators.required),
      allergies: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')])],
      organDonar: new FormControl(this.yesOrNo[0], Validators.required),
      memberTitle: new FormControl(this.memberTitles[0], Validators.required),
      typeOfMembership: new FormControl(this.typeOfMemberships[0], Validators.required),
      typeOfChapter: [(this.typeOfChapters[0], Validators.required)],
      motorcycles: this.formBuilder.array([
        this.getInitialMotorcycle()
      ])
    });

  }

  getInitialMotorcycle() {
    return this.formBuilder.group({
      color: [''],
      year: [''],
      make: [''],
      model: [''],
      licensePlate: [''],
      currentMileage: [''],
    });
  }

  addMotorcycle() {
    const control = <FormArray>this.applicationForm.controls['motorcycles'];
    control.push(this.getInitialMotorcycle());
  }

  removeMotorcycle(i: number) {
    const control = <FormArray>this.applicationForm.controls['motorcycles'];
    control.removeAt(i);
  }

  validation_messages = {
    'firstName': [{type: 'required', message: 'First Name is required.'}],
    'lastName': [{type: 'required', message: 'Last Name is required.'}],
    'email': [{type: 'required', message: 'Email is required.' }, {type: 'pattern', message: 'Enter a valid email.'}],
    'address': [{type: 'required', message: 'Address is required.'}],
    'city': [{type: 'required', message: 'City is required.'}],
    'state': [{type: 'required', message: 'State is required.'}],
    'zipCode': [{type: 'required', message: 'Zip Code is required.'}, {type: 'pattern', message: 'Enter a valid Zip Code.'}],
    'phone': [{ type: 'required', message: 'Phone is required.' }, { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }],
    'gender': [{ type: 'required', message: 'Gender is required.' }],
    'age': [{ type: 'required', message: 'Age is required.' }],
    'placeOfBirth': [{type: 'required', message: 'Place of Birth is required.'}],
    'yearsRiding': [{ type: 'required', message: 'Years Riding is required.' }],
    'licensePlate1': [{type: 'required', message: 'License Plate #1 is required.'}],
    'licensePlate2': [{type: 'required', message: 'License Plate #2 is required.'}],
    'licensePlate3': [{type: 'required', message: 'License Plate #3 is required.'}],
    'nameOfOtherClub': [{type: 'required', message: 'If YES enter club.'}],
    'nameOfEmployer': [{type: 'required', message: 'Name of employer is required, if Employed.'}],
    'yearsEmployed': [{ type: 'required', message: 'Years Employed is required, if Employed.' }],
    'occupation': [{type: 'required', message: 'Occupation is required.'}],
    'skillsPastimes': [{type: 'required', message: 'skillsPastimes is required.'}],
    'allergies': [{type: 'required', message: 'allergies is required.'}],
  }


  onEvent(event: string, item: any, e: any) {
    if (e) {
        e.stopPropagation();
    }
    if (this.events[event]) {
        this.events[event](item);
    }
}


}
