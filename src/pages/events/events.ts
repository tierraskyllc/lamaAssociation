import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, FabButton  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  params: any = {};

  mockMeetingsAndEvents= {
    title:"Monthly Meetings",
    headerImage:"assets/images/background-small/7.jpg",
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


  constructor(public navCtrl: NavController, public navParams: NavParams) {


}

toggleGroup(group: any) {
  group.show = !group.show;
}

isGroupShown(group: any) {
  return group.show;
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
