import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import { Http } from "@angular/http";
import { AlertController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'

@Injectable()
export class ShareProvider {

  loading: Loading;

  //splitpaneviewnav:any = {}
  //connection:any = {};
  //session:any = {};
  //user:any = {};

  curentpage:string = '';

  server: string = '';

  sessionid: string = '';
  role: string = '';

  username: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(private http: Http, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController) {
  	this.curentpage = 'StarterPage';

    this.server = "https://lama.tierrasky.com/backend/";
    //this.connection.headers = new Headers({ 'Content-Type': 'application/json' });

    this.sessionid = "";
    this.role = "member";

    this.username = "";
    this.firstname = "";
    this.lastname = "";
  }

  displayToolMenu(myNavCtrl) {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var decoded_response = "";
    var tmparr = null;
    var body = new FormData();
    body.append('sessionid', this.sessionid);
    this.http.post(this.server + "menu/menu.php", body).subscribe(
      data => {
        decoded_response = JSON.parse(data["_body"]);
        if (decoded_response[0] == "true") {
          tmparr = decoded_response[2];
          //=========
          var tmpbuttons = [];
          var mybutton = {};
          var tmphandler = null;
          for(var i=0; i<tmparr.length; i++) {
            if(tmparr[i] == 'Edit Profile') {
              tmphandler = () => {
                console.log('Edit Profile' + ' clicked');
              }
            }
            if(tmparr[i] == 'Manage Applications') {
              tmphandler = () => {
                myNavCtrl.push("ManageApplicationsPage");
                console.log('Manage Applications' + ' clicked');
              }
            }
            if(tmparr[i] == 'Meeting (SignIn)') {
              tmphandler = () => {
                //myNavCtrl.push("Meeting (SignIn)Page");
                console.log('Meeting (SignIn)' + ' clicked');
              }
            }
            mybutton = {
              text: tmparr[i],
              handler: tmphandler
            };
            tmpbuttons.push(mybutton);
          }
          mybutton = {
            text: 'Log Out',
            role: 'destructive',
            handler: () => {
              console.log('LOGOUT clicked');
            }
          };
          tmpbuttons.push(mybutton);
          mybutton = {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          };
          tmpbuttons.push(mybutton);
          let actionSheet = this.actionSheetCtrl.create({
            buttons: tmpbuttons
          });
          actionSheet.present();
          this.loading.dismissAll()
          //=========
        }
        else if((decoded_response[0] == "error") && ((decoded_response[1] == "Session Expired.") || (decoded_response[1] == "Invalid Session."))) {
          this.loading.dismissAll()
          myNavCtrl.push("LoginPage", { data: 'Please login again.' });
        }
        else {
          this.loading.dismissAll()
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-MENU-002");
          console.log("Unknown problem occured.  Please contact administrator.  Code: APP-MENU-002");
        }
      },
      error => {
        this.loading.dismissAll()
        this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: APP-MENU-001");
        console.log("Unknown problem occured.  Please contact administrator.  Code: APP-MENU-001");
      }
    );
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

}
