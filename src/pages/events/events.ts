import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, FabButton  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  this.params.data = {
    "title":"Meetings & Events",
    "headerImage":"assets/images/background-small/7.jpg",
    "items":[
       {
          "title":"Monthly Meetings",
          "icon":"icon-map-marker-radius",
          "items":[
             "Monuments",
             "Sightseeing",
             "Historical",
             "Sport"
          ]
       },
       {
          "title":"Regional Events",
          "icon":"icon-silverware-variant",
          "items":[
             "Fast Food",
             "Restorants",
             "Pubs",
             "Hotels"
          ]
       },
       {
          "title":"National Events",
          "icon":"icon-martini",
          "items":[
             "Caffes",
             "Bars",
             "Pubs",
             "Clubs"
          ]
       },
       {
        "title":"International Events",
        "icon":"icon-martini",
        "items":[
           "Caffes",
           "Bars",
           "Pubs",
           "Clubs"
        ]
     },
     {
        "title":"All Events",
        "icon":"icon-map-marker-radius",
        "items":[
           "Monuments",
           "Sightseeing",
           "Historical",
           "Sport"
        ]
     }
  ]
};


this.params.events = {
};

}



  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
