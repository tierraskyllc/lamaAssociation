import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";

@IonicPage()
@Component({
  selector: 'page-manage-members',
  templateUrl: 'manage-members.html',
})
export class ManageMembersPage {

  loading: Loading;

  data: any = {};

  searchTerm: string = '';
  searchTimer: any;
  items: any;
  searcheditems: any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController
  ) {
    this.data.pendingmemflag = true;
    this.data.pendingmemtitle = "List of Members";
    this.data.searchmemflag = false;
    this.data.searchmemtitle = "";
    this.items = [];
    this.searcheditems = [];
  }

  ionViewWillLoad() {
    this.getMembers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageMembersPage');
  }

  getMembers() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "members/getmembers.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.items = decoded_response[2];
            if(this.items.length > 0) {
              this.data.pendingapptitle = "List of Members"
            }
            else {
              this.data.pendingapptitle = "NO Members"
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Members-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Members-002");
          this.loading.dismissAll();
        }
      );
  }

  openMember(lama_members_id: number) {
    //console.log(lama_applications_id);
    this.navCtrl.push("ManageMemberPage", { lama_members_id: lama_members_id });
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.searchMembers();
      },1500);
  }

  searchMembers() {
    //console.log(this.searchTerm);
    if(this.searchTerm == '') {
      this.data.searchmemflag = false;
      this.data.pendingmemflag = true;
    }
    else {
      //===============================
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();
  
      var decoded_response = "";
      var body = new FormData();
      body.append('sessionid', this.shareProvider.sessionid);
      body.append('search_text', this.searchTerm);
      this.http
        .post(this.shareProvider.server + "members/searchmembers.php", body)
        .subscribe(
          data => {
            //console.log(data["_body"]);
            //console.log(data["_body"]);
            decoded_response = JSON.parse(data["_body"]);
            if (decoded_response[0] == "true") {
              this.searcheditems = decoded_response[2];
              if(this.searcheditems.length > 0) {
                this.data.searchmemtitle = "Members for search term: "+this.searchTerm;
              }
              else {
                this.data.searchmemtitle = "NO Members Found for search term: "+this.searchTerm;
              }
              this.data.searchmemflag = true;
              this.data.pendingmemflag = false;
              this.loading.dismissAll();
            }
            else if(decoded_response[0] == "false") {
              this.data.searchmemtitle = decoded_response[1];
              this.data.searchmemflag = true;
              this.data.pendingmemflag = false;
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
                console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Members-003");
                this.loading.dismissAll();
              }
            }
          },
          error => {
            this.data.error = "Unknown problem occured.  Please contact administrator.";
            this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Members-004");
            this.loading.dismissAll();
          }
        );
      //===============================
    }
  }

  public ionViewWillEnter() {
    this.getMembers();
    this.searchMembers();
  }

}
