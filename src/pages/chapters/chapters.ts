import { Component } from '@angular/core';
import { IonicPage, ModalController } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-chapters',
  templateUrl: 'chapters.html',
})
export class ChaptersPage {

  // animateItems = [];
  animateClass: any;
  data: any;
  events: any;
  chapters = [
  {
  "memberId": 1,
  "memberAssociation": "National",
  "memberCountry": "US",
  "memberState": "District of Columbia",
  "memberRegion": "East",
  "memberChapter": "Washington",
  "memberFirstName": "Christina",
  "memberLastName": "Lestrange",
  "memberDateOfBirth": "8/24/1965",
  "memberGender": "F",
  "memberEmail": "clestrange0@github.com",
  "memberAddress": "3717 Del Sol Lane",
  "memberTitle": "Member",
  "memberYearsRiding": 11,
  "image":"assets/chapterLogos/lama-washington-logo.jpg",
  }, {
  "memberId": 2,
  "memberAssociation": "National",
  "memberCountry": "US",
  "memberState": "Massachusetts",
  "memberRegion": "East",
  "memberChapter": "Holyoke",
  "memberFirstName": "Shannah",
  "memberLastName": "Priddey",
  "memberDateOfBirth": "4/1/1979",
  "memberGender": "F",
  "memberEmail": "spriddey1@amazonaws.com",
  "memberAddress": "262 Bultman Park",
  "memberTitle": "Dama",
  "memberYearsRiding": 2,
  "image":"assets/chapterLogos/lama-holyoke-logo.jpg",
  }, {
  "memberId": 3,
  "memberAssociation": "National",
  "memberCountry": "US",
  "memberState": "New Jersey",
  "memberRegion": "East",
  "memberChapter": "Newark",
  "memberFirstName": "Rhianon",
  "memberLastName": "Izachik",
  "memberDateOfBirth": "4/25/1983",
  "memberGender": "F",
  "memberEmail": "rizachik2@cnn.com",
  "memberAddress": "154 Green Ridge Street",
  "memberTitle": "Dama",
  "memberYearsRiding": 8,
  "image":"assets/chapterLogos/lama-newark-logo.jpg",
  }, {
  "memberId": 4,
  "memberAssociation": "National",
  "memberCountry": "US",
  "memberState": "Florida",
  "memberRegion": "South",
  "memberChapter": "Clermont",
  "memberFirstName": "Carrie",
  "memberLastName": "McQuaide",
  "memberDateOfBirth": "8/17/1978",
  "memberGender": "F",
  "memberEmail": "cmcquaide3@newsvine.com",
  "memberAddress": "5386 Anhalt Pass",
  "memberTitle": "Member",
  "memberYearsRiding": 14,
  "image":"assets/chapterLogos/lama-clermont-logo.jpg",
  }, {
  "memberId": 5,
  "memberAssociation": "National",
  "memberCountry": "US",
  "memberState": "Indiana",
  "memberRegion": "Mid-West",
  "memberChapter": "Poinciana",
  "memberFirstName": "Otha",
  "memberLastName": "Pulford",
  "memberDateOfBirth": "5/17/1981",
  "memberGender": "F",
  "memberEmail": "opulford4@google.de",
  "memberAddress": "1 Eastwood Place",
  "memberTitle": "Member",
  "memberYearsRiding": 12,
  "image":"assets/chapterLogos/lama-poinciana-logo.jpg",
  }, {
    "memberId": 6,
    "memberAssociation": "National",
    "memberCountry": "US",
    "memberState": "Wisconsin",
    "memberRegion": "Mid-West",
    "memberChapter": "Milwaukee",
    "memberFirstName": "Thorin",
    "memberLastName": "Greeves",
    "memberDateOfBirth": "10/8/1962",
    "memberGender": "M",
    "memberEmail": "tgreevesg@pinterest.com",
    "memberAddress": "75236 Crowley Avenue",
    "memberTitle": "Spouse",
    "memberYearsRiding": 4,
    "image":"assets/chapterLogos/lama-milwaukee-logo.jpg",
  },
  ]

  constructor(
    public modalCtrl: ModalController
  ) {
    this.animateClass = { 'zoom-in': true };
  }

  openAddChapterModal() {
    this.openModal("ChapterAddPage");
  }
  openModal(pageName) {
    this.modalCtrl.create(pageName).present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChaptersPage');
  }

}
