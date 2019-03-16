import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, FabButton  } from 'ionic-angular';
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'
import { Http } from "@angular/http";

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  loading: Loading;
  params: any = {};
  data: any = {};

  mockMeetingsAndEvents= {
    title:"L.A.M.A. Events List",
    headerImage:"assets/images/background-small/7.jpg",
    "myevents":[
      {
        "title":"North East Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      },
      {
        "title":"South East Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      },
      {
        "title":"West Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      },
      {
        "title":"South West Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      },
      {
        "title":"Mid West Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      },
      {
        "title":"All Events",
        "show": false,
        "icon":"icon-map-marker-radius",
        "events":[]
      }
    ]
  };


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController
    ) {
}

// group = "North East => 2"
toggleGroup(group: any) {
  for(var i=0; i<this.mockMeetingsAndEvents.myevents.length; i++) {
    if(this.mockMeetingsAndEvents.myevents[i] == group) {
      group.show = !group.show;
    }
    else {
      this.mockMeetingsAndEvents.myevents[i].show = false;
    }
  }
  //group.show = !group.show;
}

isGroupShown(group: any) {
  return group.show;
}

ionViewDidLoad() {
  this.getEvents();
  console.log('ionViewDidLoad EventsPage');
}

chapterEventsPage(id) {
  if(id > 0) {
    this.navCtrl.push("CalendarEventPage", { lama_events_id: id });
  }
}

getEvents() {
  this.loading = this.loadingCtrl.create({
    content: '',
  });
  this.loading.present();

  var decoded_response = "";
  var body = new FormData();
  body.append('sessionid', this.shareProvider.sessionid);
  this.http
    .post(this.shareProvider.server + "events/geteventsforregularmembers.php", body)
    .subscribe(
      data => {
        //console.log(data["_body"]);
        decoded_response = JSON.parse(data["_body"]);
        if (decoded_response[0] == "true") {
          for(var i=0; i<decoded_response[2].length; i++) {
            this.mockMeetingsAndEvents.myevents[5].events.push(decoded_response[2][i]);
            if(decoded_response[2][i]['region'] === 'North East') {
              this.mockMeetingsAndEvents.myevents[0].events.push(decoded_response[2][i]);
            }
            if(decoded_response[2][i]['region'] === 'South East') {
              this.mockMeetingsAndEvents.myevents[1].events.push(decoded_response[2][i]);
            }
            if(decoded_response[2][i]['region'] === 'West') {
              this.mockMeetingsAndEvents.myevents[2].events.push(decoded_response[2][i]);
            }
            if(decoded_response[2][i]['region'] === 'South West') {
              this.mockMeetingsAndEvents.myevents[3].events.push(decoded_response[2][i]);
            }
            if(decoded_response[2][i]['region'] === 'Mid West') {
              this.mockMeetingsAndEvents.myevents[4].events.push(decoded_response[2][i]);
            }
          }
          if(this.mockMeetingsAndEvents.myevents[0].events.length <= 0) {
            this.mockMeetingsAndEvents.myevents[0].events.push({"id": 0, "title":"No Upcoming Events", "region":""});
          }
          if(this.mockMeetingsAndEvents.myevents[1].events.length <= 0) {
            this.mockMeetingsAndEvents.myevents[1].events.push({"id": 0, "title":"No Upcoming Events", "region":""});
          }
          if(this.mockMeetingsAndEvents.myevents[2].events.length <= 0) {
            this.mockMeetingsAndEvents.myevents[2].events.push({"id": 0, "title":"No Upcoming Events", "region":""});
          }
          if(this.mockMeetingsAndEvents.myevents[3].events.length <= 0) {
            this.mockMeetingsAndEvents.myevents[3].events.push({"id": 0, "title":"No Upcoming Events", "region":""});
          }
          if(this.mockMeetingsAndEvents.myevents[4].events.length <= 0) {
            this.mockMeetingsAndEvents.myevents[4].events.push({"id": 0, "title":"No Upcoming Events", "region":""});
          }
          this.loading.dismissAll();
        }
        else {
          if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
            this.navCtrl.push("LoginPage", { data: 'Please login again.' });
            this.loading.dismissAll();
          }
          else {
            this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: Events-001");
            this.loading.dismissAll();
          }
        }
      },
      error => {
        this.data.error = "Unknown problem occured.  Please contact administrator.";
        this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
        console.log("Unknown problem occured.  Please contact administrator.  Code: Events-002");
        this.loading.dismissAll();
      }
    );
}

}
