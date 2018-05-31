import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-qrcode-modal',
  templateUrl: 'qrcode-modal.html',
})
export class QrCodeModalPage {
  myParam: string;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
    ) {
      this.myParam = params.get('myParam');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCodeModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
