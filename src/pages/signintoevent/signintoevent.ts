import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { ShareProvider } from "../../services/share";
import { AlertController } from 'ionic-angular';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the SignintoeventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signintoevent',
  templateUrl: 'signintoevent.html',
})
export class SignintoeventPage {

  data: any = {};
  loading: Loading;
  submitAttempt: boolean = false;
  signInToEventForm: FormGroup;

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
    this.data.lama_events_id = navParams.get('lama_events_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignintoeventPage');
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
         console.log('Scanned something', text);
         this.presentConfirm(text);
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

}
