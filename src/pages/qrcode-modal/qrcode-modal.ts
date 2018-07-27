import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@IonicPage()
@Component({
  selector: 'page-qrcode-modal',
  templateUrl: 'qrcode-modal.html',
})
export class QrCodeModalPage {
  myParam: string;
  value: string;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
    ) {
      //this.myParam = params.get('myParam');
      //this.value = "Vishal Gandhi";
      this.value = params.get('qrcodevalue');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCodeModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
