import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the SignintomeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signintomeeting',
  templateUrl: 'signintomeeting.html',
})
export class SignintomeetingPage {

  data: any = {};
  loading: Loading;
  submitAttempt: boolean = false;
  signInToMeetingForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private shareProvider: ShareProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private qrScanner: QRScanner
  ) {
    this.data.lama_meetings_id = navParams.get('lama_meetings_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignintomeetingPage');
  }

  public ionViewWillEnter() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    this.testScan();
  }

  ionViewWillLeave() {
    this.qrScanner.hide();
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  presentMessageOnlyAlert(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: ['OK']
    });
    alert.present();
  }

  testScan() {
    //=========================================
    this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted
       this.qrScanner.show();

       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         //console.log('Scanned something', text);
         this.signin(this.data.lama_meetings_id, text)
         //this.presentConfirm(text);
         //this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });
       //this.qrScanner.show();
     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
       console.log("Camera permission was permanently denied");
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
       console.log("Camera permission was deniied this time.  You can ask for permission again at a later time.");
     }
  })
  .catch((e: any) => console.log('Error is', e));
    //=========================================
  }

  presentConfirm(alertmsg: string) {
    let alert = this.alertCtrl.create({
      message: alertmsg,
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.pop();
          }
        },
        {
          text: 'Scan Next',
          handler: () => {
            console.log('Scan Next clicked');
            this.testScan();
          }
        }
      ]
    });
    alert.present();
  }

  signin(lama_meetings_id, qrcode) {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var hours1 = hours < 10 ? '0' + hours.toString() : hours.toString();
    var minutes1 = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    var seconds1 = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
    var month = d.getMonth() + 1;
    var month1 = month < 10 ? '0' + month.toString() : month.toString();
    var dt = d.getDate();
    var dt1 = dt < 10 ? '0' + dt.toString() : dt.toString();
    var curdttm = d.getFullYear() + '-' + month1 + '-' + dt1 + ' ' + hours1 + ':' + minutes1 + ':' + seconds1;
    //==========================================
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var body = new FormData();
    var json_encoded_response = "";
    var decoded_response = "";
    body.append('sessionid', this.shareProvider.sessionid);
    body.append('lama_meetings_id', this.data.lama_meetings_id);
    body.append('qrcode', qrcode);
    body.append('curdttm', curdttm);
    this.http.post(this.shareProvider.server + "meetings/signintomeeting.php", body).subscribe(
      data => {
        decoded_response = JSON.parse(data["_body"]);
        //console.log(data["_body"]);
        if (decoded_response[0] == "true") {
          this.presentConfirm(decoded_response[2]);
          this.loading.dismissAll();
        }
        else {
          this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: SITE-008");
          console.log("Unknown problem occured.  Please contact administrator.  Code: SITE-008");
          this.loading.dismissAll();
        }
      },
      error => {
        this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.  Code: SITE-009");
        console.log("Unknown problem occured.  Please contact administrator.  Code: SITE-009");
        this.loading.dismissAll();
      }
    );
    //==========================================
  }

}