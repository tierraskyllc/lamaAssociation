import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";

/**
 * Generated class for the ManageChaptersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-chapters',
  templateUrl: 'manage-chapters.html',
})
export class ManageChaptersPage {

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
    public loadingCtrl: LoadingController) {
      this.data.searchchapterflag = false;
      this.data.searchapptitle = "";
      this.data.addtype = "";
      this.items = [];
      this.searcheditems = [];
  }

  ionViewWillLoad() {
    //this.getChapters();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageChaptersPage');
  }

  public ionViewWillEnter() {
    this.getChapters();
    this.searchChapters();
  }

  getChapters() {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var body = new FormData();
    body.append('sessionid', this.shareProvider.sessionid);
    this.http
      .post(this.shareProvider.server + "chapters/listchapters.php", body)
      .subscribe(
        data => {
          //console.log(data["_body"]);
          var mydt, mm, dd, yyyy = null;
          decoded_response = JSON.parse(data["_body"]);
          if (decoded_response[0] == "true") {
            this.items = decoded_response[2];
            for(var i=0; i<this.items.length; i++) {
              if((this.items[i]['country'] !== null) && (this.items[i]['country'] == 'United States')) {
                this.data.addtype = 'national';
                break;
              }
              else {
                this.data.addtype = 'international';
                break;
              }
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
              console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Chapters-001");
              this.loading.dismissAll();
            }
          }
        },
        error => {
          this.data.error = "Unknown problem occured.  Please contact administrator.";
          this.shareProvider.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
          console.log("Unknown problem occured.  Please contact administrator.  Code: Manage-Chapters-002");
          this.loading.dismissAll();
        }
      );
  }

  searchChapters() {
    this.searcheditems = [];
    if(this.searchTerm == '') {
      this.data.searchchapterflag = false;
    }
    else {
      for(var i=0; i<this.items.length; i++) {
        if(this.items[i]['description'] == null) {
          this.items[i]['description'] = '';
        }
        if(this.items[i]['country'] == null) {
          this.items[i]['country'] = '';
        }
        if(this.items[i]['region'] == null) {
          this.items[i]['region'] = '';
        }
        if(this.items[i]['state'] == null) {
          this.items[i]['state'] = '';
        }
        if(this.items[i]['city'] == null) {
          this.items[i]['city'] = '';
        }
        if((this.items[i]['name'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['description'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['country'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['state'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['city'].toUpperCase().includes(this.searchTerm.toUpperCase())) || (this.items[i]['region'].toUpperCase().includes(this.searchTerm.toUpperCase()))) {
          this.searcheditems[this.searcheditems.length] = this.items[i];
        }
      }
      if(this.searcheditems.length > 0) {
        this.data.searchchaptertitle = "Chapters for search term: " + this.searchTerm;
      }
      else {
        this.data.searchchaptertitle = "NO Chapters Found for search term: " + this.searchTerm;
      }
      this.data.searchchapterflag = true;
    }
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.searchChapters();
      },500);
  }

  addChapter() {
    this.navCtrl.push("AddChapterPage", { addtype: this.data.addtype });
  }

  openChapter(lama_chapters_id, chapter_type) {
    this.navCtrl.push("ManageChapterPage", { addtype: chapter_type, lama_chapters_id: lama_chapters_id });
  }

}
