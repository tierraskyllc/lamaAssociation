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
    title:"L.A.M.A. Events List",
    headerImage:"assets/images/background-small/7.jpg",
    "items":[
      {
         "title":"Local Events",
         "show": false,
         "icon":"icon-map-marker-radius",
         "chapters":[
            "Monuments",
            "Sightseeing",
            "Historical",
            "Sport"
         ]
      },
      {
         "title":"Mid West Events",
         "show": false,
         "icon":"icon-silverware-variant",
         "chapters":[
          "L.A.M.A. Illinois",
          "L.A.M.A. Indiana",
          "L.A.M.A. Missouri",
          "L.A.M.A. Wisconsin",
          "L.A.M.A. Will County",
          "L.A.M.A. Elgin",
          "L.A.M.A. Chicago HQ",
          "L.A.M.A. Ciero",
          "L.A.M.A. Chicago South",
          "L.A.M.A. Chicago West",
          "L.A.M.A. St Louis",
          "L.A.M.A. Crown Point",
          "L.A.M.A. Indianapolis",
          "L.A.M.A. Midway",
          "L.A.M.A. Northwest",
          "L.A.M.A. Milwaukee",
        ]
      },
      {
         "title":"North East Events",
         "show": false,
         "icon":"icon-martini",
         "chapters":[
            "L.A.M.A. Keansburg",
            "L.A.M.A. Newark",
            "L.A.M.A. Pennsauken",
            "L.A.M.A. Perth Amboy",
            "L.A.M.A. Vineland"
         ]
        },
        {
           "title":"South East Events",
           "show": false,
           "icon":"icon-martini",
           "chapters":[
            "L.A.M.A. Ft Worth",
            "L.A.M.A. New Mexico",
            "L.A.M.A. Dallas",
            "L.A.M.A. San Antonio",
            "L.A.M.A. McAllen"
           ]
          },
          {
             "title":"South West Events",
             "show": false,
             "icon":"icon-martini",
             "chapters":[
              "L.A.M.A. Florida",
              "L.A.M.A. Georgia",
              "L.A.M.A. North Carolina",
              "L.A.M.A. Tampa",
              "L.A.M.A. Boca Raton",
              "L.A.M.A. Brandon",
              "L.A.M.A. Clermont",
              "L.A.M.A. Deltona",
              "L.A.M.A. Ft Myers",
              "L.A.M.A. Jacksonville",
              "L.A.M.A. Jax Beach",
              "L.A.M.A. Kissimmee",
              "L.A.M.A. Miami",
              "L.A.M.A. Naples",
              "L.A.M.A. Orlando",
              "L.A.M.A. Palm Beach County",
              "L.A.M.A. Poinciana",
              "L.A.M.A. Port St. Lucie",
              "L.A.M.A. Sarasota",
              "L.A.M.A. Sebring",
              "L.A.M.A. Spring Hill",
              "L.A.M.A. St. Augustine",
              "L.A.M.A. Atlanta",
              "L.A.M.A. Atlanta South",
              "L.A.M.A. Savannah",
              "L.A.M.A. Colubia",
             ]
            },
            {
               "title":"West Events",
               "show": false,
               "icon":"icon-martini",
               "chapters":[
                "L.A.M.A. Los Angeles",
                "L.A.M.A. San Jose"
               ]
            },
            {
            "title":"International Events",
            "show": false,
            "icon":"icon-martini",
            "chapters":[
                "Caffes",
                "Bars",
                "Pubs",
                "Clubs"
            ]
          },
          {
            "title":"All Events",
            "show": false,
            "icon":"icon-map-marker-radius",
            "chapters":[
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

// group = "North East => 2"
toggleGroup(group: any) {
  for(var i=0; i<this.mockMeetingsAndEvents.items.length; i++) {
    if(this.mockMeetingsAndEvents.items[i] == group) {
      group.show = !group.show;
    }
    else {
      this.mockMeetingsAndEvents.items[i].show = false;
    }
  }
  //group.show = !group.show;
}

isGroupShown(group: any) {
  return group.show;
}

ionViewDidLoad() {
  console.log('ionViewDidLoad EventsPage');
}

chapterEventsPage() {
  this.navCtrl.push("ChapterEventsPage");
}

}
