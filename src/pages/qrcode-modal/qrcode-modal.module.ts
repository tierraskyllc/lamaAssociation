import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCodeModalPage } from './qrcode-modal';
import { NgxQRCodeModule } from 'ngx-qrcode3';

@NgModule({
  declarations: [
    QrCodeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(QrCodeModalPage),
    NgxQRCodeModule
  ],
})
export class QrCodeModalPageModule {}
