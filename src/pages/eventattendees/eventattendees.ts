import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from 'ionic-angular'

/**
 * Generated class for the EventattendeesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventattendees',
  templateUrl: 'eventattendees.html',
})
export class EventattendeesPage {

  loading: Loading;

  data: any = {};
  items: any;
  searchitems: any;
  sortitems: any;
  searchTerm: string = '';
  searchTimer: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController) {
      this.data.lama_events_id = navParams.get('lama_events_id');
      this.data.maxid = 0;
      this.items = [];
      this.searchitems = [];
      this.sortitems = [];
      this.data.selection = 'livefeed';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventattendeesPage');
  }

  ionViewWillLoad() {
    this.getEventAttendees();
    this.data.intervalvar = setInterval(() => {      
      //console.log('timer');
      this.getMoreEventAttendees();
      },5000);
  }

  ionViewWillEnter() {
    this.getEventAttendees();
  }
  
  ionViewWillLeave() {
    clearInterval(this.data.intervalvar);
  }

  getEventAttendees() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();
    this.data.items = [];
    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_events_id', this.data.lama_events_id);
    this.http
      .post(this.shareProvider.server + "events/geteventattendees.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              var d = new Date(decoded_response[2][i]["dttm_signedin"]);
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              var month = d.getMonth()+1;
              var month1 = month < 10 ? '0' + month.toString() : month.toString();
              var dt = d.getDate();
              var dt1 = dt < 10 ? '0' + dt.toString() : dt.toString();
              decoded_response[2][i]["dttm_signedin"] = month1 + '-' + dt1 + '-' + d.getFullYear() + ' ' + strTime;
              if(decoded_response[2][i]["id"] > this.data.maxid) {
                this.data.maxid = decoded_response[2][i]["id"];
              }
            }
            this.items = decoded_response[2];
            this.data.selection = 'livefeed';
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: EventAttendees-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: EventAttendees-002");
          this.loading.dismissAll();
        }
      );
  }
  
    getMoreEventAttendees() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_events_id', this.data.lama_events_id);
    body.append('lama_events_signins_id', this.data.maxid);
    this.http
      .post(this.shareProvider.server + "events/getmoreeventattendees.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            for(var i=0; i<decoded_response[2].length; i++) {
              var d = new Date(decoded_response[2][i]["dttm_signedin"]);
              var hours = d.getHours();
              var minutes = d.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
              var strTime = hours + ':' + minutes1 + ' ' + ampm;
              var month = d.getMonth()+1;
              var month1 = month < 10 ? '0' + month.toString() : month.toString();
              var dt = d.getDate();
              var dt1 = dt < 10 ? '0' + dt.toString() : dt.toString();
              decoded_response[2][i]["dttm_signedin"] = month1 + '-' + dt1 + '-' + d.getFullYear() + ' ' + strTime;
              this.items.unshift(decoded_response[2][i]);
              if(decoded_response[2][i]["id"] > this.data.maxid) {
                this.data.maxid = decoded_response[2][i]["id"];
              }
            }
            //this.items = decoded_response[2];
            //this.loading.dismissAll();
          }
          else {
            if((decoded_response[1] == 'Session Expired.') || (decoded_response[1] == 'Invalid Session.')) {
              clearInterval(this.data.intervalvar);
              this.navCtrl.push("LoginPage", { data: 'Please login again.' });
              //this.loading.dismissAll();
            }
            else {
              clearInterval(this.data.intervalvar);
              this.data.error = "Unknown problem occured.  Please contact administrator.";
              this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
              console.log("Unknown problem occured.  Please contact administrator.  Code: EventAttendees-001");
              //this.loading.dismissAll();
            }
          }
        },
        error => {
          clearInterval(this.data.intervalvar);
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: EventAttendees-002");
          //this.loading.dismissAll();
        }
      );
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.actualsearch();
      },1000);
  }

  actualsearch() {
    if(this.searchTerm == '') {
      this.livefeed();
    }
    else {
      /*this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();*/
      clearInterval(this.data.intervalvar);
      this.data.searchattendeestitle = "No attendee found for search term: " + this.searchTerm;
      this.searchitems = [];
      for(var i=0; i<this.items.length; i++) {
        if((this.items[i]['first_name'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['last_name'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['title'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['chapter_name'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['dttm_signedin'].toUpperCase().includes(this.searchTerm.toUpperCase()))) {
          this.searchitems[this.searchitems.length] = this.items[i];
        }
      }
      this.data.selection = 'searchfeed';
      //this.loading.dismissAll();
    }
  }

  livefeed() {
    this.getEventAttendees();
    this.data.intervalvar = setInterval(() => {      
      //console.log('timer');
      this.getMoreEventAttendees();
      },5000);
  }

  sortbyname() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();*/
    clearInterval(this.data.intervalvar);
    this.sortitems = [];
    this.items.sort(function(x, y) {
        var a = x.first_name.toUpperCase();
        var b = y.first_name.toUpperCase();
        if(a > b) {
          return 1;
        }
        if(a < b) {
          return -1;
        }
        return 0;
      }
    );
    /*this.items.sort(function(x, y) {
        var a = x.last_name.toUpperCase();
        var b = y.last_name.toUpperCase();
        if(a > b) {
          return 1;
        }
        if(a < b) {
          return -1;
        }
        return 0;
      }
    );*/
    this.sortitems = this.items;
    //this.loading.dismissAll();
    this.data.selection = 'sortfeed';
  }

}
