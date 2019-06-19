import { Component } from "@angular/core";
import { NavController, IonicPage, ModalController } from "ionic-angular";
//import { ToastService } from "../../services/toast.service";
import { ActionSheetController } from "ionic-angular";
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { LoadingController, Loading, Platform, ToastController } from "ionic-angular";
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  loading: Loading;
  lastImage: string = "";
  lastImageFullPath: string = "";
  isUploadImageRunning: boolean = false;
  data: any = {};
  following = false;
  signingIn = false;
  underConstruction = false;
  member = {
    name: "",
    //profileImage: "assets/images/avatar/girl-avatar.png",
    profileImage: "assets/images/avatar/nopic.png",
    profileQrImage: "assets/images/qr-code.png",
    coverImage: "assets/images/background/background-5.jpg",
    chapter: "",
    status: "",
    title: "",
    profile_pic: null,
    followers: 456,
    following: 1051,
    memberSince: 2003,
    easyid: ""
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
    //public toastCtrl: ToastService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    private alertCtrl: AlertController
  ) {
  }
  garagePage() {
    this.navCtrl.push("GaragePage");
  }

  membersPage() {
    this.navCtrl.push("ChapterMembersPage");
  }

  eventsPage() {
    this.navCtrl.push("EventsPage");
  }

  chatRoomPage() {
    // this.navCtrl.push("chatRoomPage");
  }

  mapPage() {
    // this.navCtrl.push("mapPage");
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

  ionViewWillEnter() {
    this.eventList = [];
    this.date = new Date();
    this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    this.getDaysOfMonth();
    setInterval(() => {
      //console.log('timer');
      this.uploadImage();
      },2000);
  }

  ionViewDidLoad() {
    //this.loadProfileInfo();
    //this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    //console.log("Hello ProfileFour Page");
  }

  ionViewDidEnter() {
    this.loadProfileInfo();
  }

  signIn() {
    this.signingIn = !this.signingIn;
    //this.toastCtrl.create("Signing In member clicked");
  }

  follow() {
    this.following = !this.following;
    //this.toastCtrl.create("Follow member clicked");
  }

  imageTapped(post) {
    //this.toastCtrl.create("Post image clicked");
  }

  comment(post) {
    //this.toastCtrl.create("Comments clicked");
  }

  like(post) {
    //this.toastCtrl.create("Like clicked");
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
                this.member.easyid = decoded_response[2]["easyid"];
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
              decoded_response[2]["dttmcreated"].replace(/-/g,'/')
            ).getFullYear();
            this.member.following = decoded_response[2]["total_miles"];
            if(!((decoded_response[2]["profile_pic"] === 'null') || (decoded_response[2]["profile_pic"] == null))) {
              this.member.profile_pic = decoded_response[2]["profile_pic"];
              this.displayProfilePic(this.member.profile_pic);
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
    this.eventList = [];
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.eventList = [];
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getCalendarMonth(this.date.getFullYear(), this.date.getMonth()+1);
    this.getDaysOfMonth();
  }

  checkEvent(day) {
    //console.log(day);
    var hasEvent = false;
    var thisDate1 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 23:59:59");
    this.eventList.forEach(event => {
      //var eventStartDate = new Date(event.start_dttm);
      //var eventEndDate = new Date(event.end_dttm);
      //console.log(event.start_dttm);
      //console.log(event.end_dttm);
      //console.log(thisDate1);
      //console.log(thisDate2);
      //if((event.start_dttm >= thisDate1) && (event.end_dttm >= thisDate1) && (event.end_dttm >= thisDate2)) {
      if(((event.start_dttm >= thisDate1) && (event.end_dttm <= thisDate2)) || ((thisDate2 >= event.start_dttm) && (thisDate2 <= event.end_dttm)) || ((thisDate1 >= event.start_dttm) && (thisDate1 <= event.end_dttm))) {
        if(event.type ==='event') {
          hasEvent = true;
        }
      }
      //console.log(hasEvent);
    });
    return hasEvent;
  }

  checkMeeting(day) {
    //console.log(day);
    var hasEvent = false;
    var thisDate1 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 23:59:59");
    this.eventList.forEach(event => {
      //var eventStartDate = new Date(event.start_dttm);
      //var eventEndDate = new Date(event.end_dttm);
      //console.log(event.start_dttm);
      //console.log(event.end_dttm);
      //console.log(thisDate1);
      //console.log(thisDate2);
      //if((event.start_dttm >= thisDate1) && (event.end_dttm >= thisDate1) && (event.end_dttm >= thisDate2)) {
      if(((event.start_dttm >= thisDate1) && (event.end_dttm <= thisDate2)) || ((thisDate2 >= event.start_dttm) && (thisDate2 <= event.end_dttm)) || ((thisDate1 >= event.start_dttm) && (thisDate1 <= event.end_dttm))) {
        if(event.type ==='meeting') {
          hasEvent = true;
        }
      }
      //console.log(hasEvent);
    });
    return hasEvent;
  }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear()+"/"+(this.date.getMonth()+1)+"/"+day+" 23:59:59");
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
    if(this.selectedEvent.length > 0) {
      this.navCtrl.push("CalendarDayPage", { selecteddate: (this.date.getMonth()+1) + '/' + day + '/' + this.date.getFullYear(), items: this.selectedEvent });
    }
  }

  getCalendarMonth(year, month) {
    //console.log(year);
    //console.log(month);
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
              decoded_response[2][i]['start_dttm'] = new Date(decoded_response[2][i]['start_dttm'].replace(/-/g,'/'));
              decoded_response[2][i]['end_dttm'] = new Date(decoded_response[2][i]['end_dttm'].replace(/-/g,'/'));
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

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.lastImageFullPath = correctPath + currentName;
          });
      } else {
        //this.presentMessageOnlyAlert('checkpoint-1');
        //this.presentMessageOnlyAlert(imagePath);
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //this.presentMessageOnlyAlert('checkpoint-2');
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.presentMessageOnlyAlert('checkpoint-3');
        //this.presentMessageOnlyAlert(correctPath);
        //this.presentMessageOnlyAlert(currentName);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        //this.presentMessageOnlyAlert('checkpoint-4');
        this.lastImageFullPath = imagePath;
      }
      //this.uploadImage();
    }, (err) => {
      this.presentToast('Error while selecting image.' + err);
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  this.shareProvider.username + '_profile_pic_' + n + ".jpg";
    //this.presentMessageOnlyAlert(newFileName);
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    //this.presentMessageOnlyAlert(this.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.lastImage = newFileName;
      //this.presentToast('Error while storing file.');
      console.log('Error while storing file.  This error can be safely ignored.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 10000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    //this.presentToast('Inside uploadImage');
    if((this.lastImage != "") && (this.lastImageFullPath != "") && (this.isUploadImageRunning != true)) {
      //this.presentToast('Inside uploadImage');
      this.isUploadImageRunning = true;
      //this.presentToast(this.lastImage);
      //this.presentToast(this.lastImageFullPath);
    // Destination URL
      var url = this.shareProvider.server + "application/upload.php";

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      var filename = this.lastImage;

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'sessionid': this.shareProvider.sessionid}
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(this.lastImageFullPath, url, options).then((data) => {
        this.updateProfilePicInDB(this.lastImage);
        this.loading.dismissAll();
        this.presentToast('Image succesful uploaded.');
        //this.presentToast(this.lastImage);
        this.lastImage = "";
        this.lastImageFullPath = "";
        this.isUploadImageRunning = false;
      }, (err) => {
        this.loading.dismissAll();
        this.presentToast('Error while uploading image(s).');
        this.isUploadImageRunning = false;
      });
    }
  }

  public changeProfilePic() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  updateProfilePicInDB(lastImage) {
    //this.submitAttempt = true;
    //if (this.editProfileForm.valid) {
      var body = new FormData();
      var json_encoded_response = "";
      var decoded_response = "";
      body.append('sessionid', this.shareProvider.sessionid);
      body.append("profile_pic", lastImage);
      this.http
        .post(this.shareProvider.server + "profile/changeprofilepic.php", body)
        .subscribe(
          data => {
            json_encoded_response = data["_body"];
            //console.log(json_encoded_response);
            decoded_response = JSON.parse(json_encoded_response);
            //console.log(decoded_response);
            if (decoded_response[0] === "error") {
              this.data.error = decoded_response[1];
              this.presentMessageOnlyAlert(decoded_response[1]);
            } else {
              if (decoded_response[0]) {
                console.log(decoded_response[2]);
                this.displayProfilePic(lastImage);
                //this.presentMessageOnlyAlert(decoded_response[2]);
                //this.navCtrl.pop();
              }
              else if (!decoded_response[0]) {
                this.data.error = decoded_response[2];
                this.presentMessageOnlyAlert(decoded_response[2]);
              } else {
                this.data.error = "Problem changing profile picture.  Please check your internet connection.  Contact administrator if problem persists.";
                this.presentMessageOnlyAlert("Problem changing profile picture.  Please check your internet connection.  Contact administrator if problem persists.");
              }
            }
          },
          error => {
            this.data.error =
              "Problem changing profile picture.  Please check your internet connection.  Contact administrator if problem persists.";
          }
        );
    //}
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

  displayProfilePic(profile_pic) {
      /*this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();*/

      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      ////body.append('docname', motorcyclesobjects[num]['odometerPic']);
      body.append('docname', profile_pic);
      this.http.post(this.shareProvider.server + "docdownload/tempsession.php", body).subscribe(
        data => {
          var decoded_response = JSON.parse(data["_body"]);
          //console.log(data["_body"]);
          if (decoded_response[0] == "true") {
            //console.log(decoded_response[1]);
            //----------
            var docurl = this.shareProvider.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + profile_pic;
            this.member.profileImage = docurl;
            //console.log(this.member.profileImage);
            //----------
            //this.loading.dismissAll();
          }
          else {
            //this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.presentMessageOnlyAlert("Problem displaying profile picture.  Please contact administrator.");
            console.log("Problem displaying profile picture.  Please contact administrator.");
            //this.loading.dismissAll();
          }
        },
        error => {
          //this.data.error = "Unknown problem occured.  Please contact administrator.";
          //console.log("Oooops!");
          this.presentMessageOnlyAlert("Problem displaying profile picture.  Please contact administrator.");
          console.log("Problem displaying profile picture.  Please contact administrator.");
          //this.loading.dismissAll();
        }
      );
  }
}
