import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-manage-members',
  templateUrl: 'manage-members.html',
})
export class ManageMembersPage {

  mockMangeMembers= {
    "members":[{
      "chapter": "Chicago West",
      "member": "Nikita Vlasyev",
      "title": "Probate",
      "miles": 312096
    }, {
      "chapter": "Midway",
      "member": "Portia Cowdry",
      "title": "Dama",
      "miles": 303329
    }, {
      "chapter": "Indianapolis",
      "member": "Elisabeth Pendrid",
      "title": "Vice-President",
      "miles": 138185
    }, {
      "chapter": "Indianapolis",
      "member": "Fredrika Mathevet",
      "title": "Sgt of Arms",
      "miles": 878634
    }, {
      "chapter": "Chicago HQ",
      "member": "Ken Howling",
      "title": "Treasury",
      "miles": 726294
    }, {
      "chapter": "Crown Point",
      "member": "Dido Copeland",
      "title": "Vice-President",
      "miles": 28813
    }, {
      "chapter": "Crown Point",
      "member": "Catlin Dominka",
      "title": "Dama",
      "miles": 424764
    }, {
      "chapter": "Chicago South",
      "member": "Effie Mateu",
      "title": "President",
      "miles": 342551
    }, {
      "chapter": "Missouri",
      "member": "Hardy Minocchi",
      "title": "Probate",
      "miles": 87432
    }, {
      "chapter": "Illinois",
      "member": "Valentia Mankowski",
      "title": "Business Manager",
      "miles": 331252
    }, {
      "chapter": "Crown Point",
      "member": "Ximenez Fowlie",
      "title": "President",
      "miles": 213862
    }, {
      "chapter": "Illinois",
      "member": "Cynthea Bodleigh",
      "title": "Riding Member",
      "miles": 89695
    }, {
      "chapter": "Northwest",
      "member": "Koralle Leacock",
      "title": "Business Manager",
      "miles": 992173
    }, {
      "chapter": "Chicago HQ",
      "member": "Johnathon Pitfield",
      "title": "Sgt of Arms",
      "miles": 694965
    }, {
      "chapter": "Chicago HQ",
      "member": "Zia Pitchford",
      "title": "Probate",
      "miles": 652017
    }, {
      "chapter": "Will County",
      "member": "Bibby Brodway",
      "title": "Probate",
      "miles": 650588
    }, {
      "chapter": "Crown Point",
      "member": "Allis McIlmorow",
      "title": "Riding Member",
      "miles": 172149
    }, {
      "chapter": "Wisconsin",
      "member": "Shanna Halsho",
      "title": "President",
      "miles": 780632
    }, {
      "chapter": "Chicago West",
      "member": "Moyna Rising",
      "title": "Vice-President",
      "miles": 355009
    }, {
      "chapter": "Midway",
      "member": "Tarah Wortt",
      "title": "Treasury",
      "miles": 211055
    }, {
      "chapter": "Wisconsin",
      "member": "Marylinda Mossom",
      "title": "Sgt of Arms",
      "miles": 933029
    }, {
      "chapter": "Chicago HQ",
      "member": "Oliviero Seedman",
      "title": "Dama",
      "miles": 917426
    }, {
      "chapter": "Crown Point",
      "member": "Aurilia Tieraney",
      "title": "Dama",
      "miles": 631433
    }, {
      "chapter": "Chicago South",
      "member": "Tabor Nestor",
      "title": "M/T Officer",
      "miles": 591707
    }]
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageMembersPage');
  }

}
