import { Component } from "@angular/core";
import { NavController, IonicPage, ModalController } from "ionic-angular";
import { ToastService } from "../../services/toast.service";
import { ActionSheetController } from "ionic-angular";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  loading: Loading;

  data: any = {};
  following = false;
  signingIn = false;
  underConstruction = false;
  member = {
    name: "Name from Server",
    profileImage: "assets/images/avatar/girl-avatar.png",
    profileQrImage: "assets/images/qr-code.png",
    coverImage: "assets/images/background/background-5.jpg",
    chapter: "L.A.M.A. Newark",
    status: "Full Pathed Member",
    title: "Road Captain",
    followers: 456,
    following: 1051,
    memberSince: 2003
  };

  posts = [
    {
      postImageUrl: "assets/images/background/background-2.jpg",
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: "November 5, 2016",
      likes: 12,
      comments: 4,
      timestamp: "11h ago"
    }
  ];

  // Variables for calendar
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  //monthNames: string[];
  monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  mymonth = new Date().getMonth();
  myyear = new Date().getFullYear();
  //event = { title: "", location: "", message: "", start_dttm: "", end_dttm: "" };
  event = {"id":0,"0":0,"title":"","1":"","description":"","2":"","start_dttm":"","3":"","end_dttm":"","4":"","type":"","5":""};
  eventList: any;
  selectedEvent: any;
  isSelected: any;

  constructor(
    private http: Http,
    private shareProvider: ShareProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController
  ) {
    // Calendar //
    this.eventList = [];
    this.date = new Date();
    this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    this.getDaysOfMonth();
    //this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth());
    //this.eventList.push({ title: "First Test Event", location: "Location for First Test Event", message: "This is just a test event.", start_dttm: new Date('2018-11-17 15:20:00'), end_dttm: new Date('2018-11-18 22:00:00') })
  }

  eventsPage() {
    this.navCtrl.push("EventsPage");
  }

  garagePage() {
    this.navCtrl.push("GaragePage");
  }

  chaptersPage() {
    this.navCtrl.push("ChaptersPage");
  }

  openQrCodeModal() {
    this.openModal("QrCodeModalPage");
  }

  openModal(pageName) {
    this.modalCtrl
      .create(
        pageName,
        {
          qrcodevalue:
            this.shareProvider.username +
            "|" +
            this.shareProvider.firstname +
            "|" +
            this.shareProvider.lastname
        },
        { cssClass: "inset-modal" }
      )
      .present();
  }

  ionViewDidLoad() {
    this.loadProfileInfo();
    //this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    console.log("Hello ProfileFour Page");
  }

  signIn() {
    this.signingIn = !this.signingIn;
    this.toastCtrl.create("Signing In member clicked");
  }

  follow() {
    this.following = !this.following;
    this.toastCtrl.create("Follow member clicked");
  }

  imageTapped(post) {
    this.toastCtrl.create("Post image clicked");
  }

  comment(post) {
    this.toastCtrl.create("Comments clicked");
  }

  like(post) {
    this.toastCtrl.create("Like clicked");
  }

  loadProfileInfo() {
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "profile/profile.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            if (decoded_response[2]["is_member_approved"] == 0) {
              this.navCtrl.push("ApplicationPage");
              this.loading.dismissAll();
            } else {
              if (decoded_response[2]["is_member_approved"] == 1) {
                this.member.name =
                  decoded_response[2]["first_name"] +
                  " " +
                  decoded_response[2]["last_name"];
                this.member.chapter = decoded_response[2]["chapter_name"];
              }
              this.loading.dismissAll();
            }
          } else {
            if (
              decoded_response[1] == "Session Expired." ||
              decoded_response[1] == "Invalid Session."
            ) {
              this.navCtrl.push("LoginPage");
              this.loading.dismissAll();
            } else {
              this.data.error =
                "Unknown problem occured.  Please contact administrator.";
              console.log(
                "Unknown problem occured.  Please contact administrator. - L001"
              );
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error =
            "Unknown problem occured.  Please contact administrator.";
          console.log(
            "Unknown problem occured.  Please contact administrator. - L002"
          );
          this.loading.dismissAll();
        }
      );
    //-----
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "profile/profileinfo.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            this.member.status = decoded_response[2]["type_of_membership"];
            this.member.title = decoded_response[2]["member_title"];
            this.member.memberSince = new Date(
              decoded_response[2]["dttmcreated"]
            ).getFullYear();
            this.member.following = decoded_response[2]["total_miles"];
            this.loading.dismissAll();
          } else {
            if (
              decoded_response[1] == "Session Expired." ||
              decoded_response[1] == "Invalid Session."
            ) {
              this.navCtrl.push("LoginPage");
              this.loading.dismissAll();
            } else {
              this.data.error =
                "Unknown problem occured.  Please contact administrator.";
              console.log(
                "Unknown problem occured.  Please contact administrator. - L001"
              );
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error =
            "Unknown problem occured.  Please contact administrator.";
          console.log(
            "Unknown problem occured.  Please contact administrator. - L002"
          );
          this.loading.dismissAll();
        }
      );
    //-----
  }

  // Functions for calendar
  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    //console.log(this.currentMonth);
    this.currentYear = this.date.getFullYear();
    //console.log(this.currentYear);
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
      //console.log(this.currentDate);
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i+1);
    }
  
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  checkEvent(day) {
    //console.log(day);
    var hasEvent = false;
    var thisDate1 = new Date(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59");
    this.eventList.forEach(event => {
      //var eventStartDate = new Date(event.start_dttm);
      //var eventEndDate = new Date(event.end_dttm);
      //console.log(event.start_dttm);
      //console.log(event.end_dttm);
      //console.log(thisDate1);
      //console.log(thisDate2);
      //if((event.start_dttm >= thisDate1) && (event.end_dttm >= thisDate1) && (event.end_dttm >= thisDate2)) {
      if(((event.start_dttm >= thisDate1) && (event.end_dttm <= thisDate2)) || ((thisDate2 >= event.start_dttm) && (thisDate2 <= event.end_dttm)) || ((thisDate1 >= event.start_dttm) && (thisDate1 <= event.end_dttm))) {
        hasEvent = true;
      }
      //console.log(hasEvent);
    });
    return hasEvent;
  }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = new Date(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59");
    //console.log('checkpoint-1');
    this.eventList.forEach(event => {
      //console.log('checkpoint-2');
      //if(((event.start_dttm >= thisDate1) && (event.start_dttm <= thisDate2)) || ((event.end_dttm >= thisDate1) && (event.end_dttm <= thisDate2))) {
      if(((event.start_dttm >= thisDate1) && (event.end_dttm <= thisDate2)) || ((thisDate2 >= event.start_dttm) && (thisDate2 <= event.end_dttm)) || ((thisDate1 >= event.start_dttm) && (thisDate1 <= event.end_dttm))) {
        this.isSelected = true;
        this.selectedEvent.push(event);
        //console.log('checkpoint-3');
      }
      //console.log('checkpoint-4');
    });
    for(var i=0; i<this.selectedEvent.length; i++) {
      this.selectedEvent[i]['start_dttm'] = this.selectedEvent[i]['start_dttm'].toDateString() + ' ' + this.formatAMPM(this.selectedEvent[i]['start_dttm']);
      this.selectedEvent[i]['end_dttm'] = this.selectedEvent[i]['end_dttm'].toDateString() + ' ' + this.formatAMPM(this.selectedEvent[i]['end_dttm']);
    }
    this.navCtrl.push("CalendarDayPage", { selecteddate: (this.date.getMonth()+1) + '-' + day + '-' + this.date.getFullYear(), items: this.selectedEvent });
  }

  getCalendarMonth(year, month) {
    console.log(year);
    console.log(month);
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    //-----
    var decoded_response = "";
    var body = new FormData();
    body.append("sessionid", this.shareProvider.sessionid);
    body.append("year", year);
    body.append("month", month);
    this.http
      .post(this.shareProvider.server + "profile/calendar.php", body)
      .subscribe(
        data => {
          decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[2]);
            for(var i=0; i<decoded_response[2].length; i++) {
              decoded_response[2][i]['start_dttm'] = new Date(decoded_response[2][i]['start_dttm']);
              decoded_response[2][i]['end_dttm'] = new Date(decoded_response[2][i]['end_dttm']);
              this.eventList.push(decoded_response[2][i]);
              //this.eventList.push({ title: "First Test Event", location: "Location for First Test Event", message: "This is just a test event.", start_dttm: new Date('2018-11-17 15:20:00'), end_dttm: new Date('2018-11-18 22:00:00') });
              //console.log(decoded_response[2][i]["id"]);
              //console.log(decoded_response[2][i]["title"]);
            }
            this.loading.dismissAll();
          } else {
            if (
              decoded_response[1] == "Session Expired." ||
              decoded_response[1] == "Invalid Session."
            ) {
              this.navCtrl.push("LoginPage");
              this.loading.dismissAll();
            } else {
              this.data.error =
                "Unknown problem occured.  Please contact administrator.";
              console.log(
                "Unknown problem occured.  Please contact administrator. - CAL001"
              );
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error =
            "Unknown problem occured.  Please contact administrator.";
          console.log(
            "Unknown problem occured.  Please contact administrator. - CAL002"
          );
          this.loading.dismissAll();
        }
      );
    //-----
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}
