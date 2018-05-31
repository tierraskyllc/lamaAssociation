import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCodeModalPage } from './qrcode-modal';

@NgModule({
  declarations: [
    QrCodeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(QrCodeModalPage),
  ],
})
export class QrCodeModalPageModule {}
