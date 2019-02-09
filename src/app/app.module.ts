import { ToastService } from './../services/toast.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { ShareProvider } from '../services/share';
import { MyApp } from './app.component';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IonicSelectableModule } from 'ionic-selectable';
import { SignaturePadModule } from 'angular2-signaturepad';
//import { Transfer } from '@ionic-native/transfer';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicSelectableModule,
    SignaturePadModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    IonicModule.forRoot(MyApp)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ShareProvider,
    ToastService,
    File,
    //Transfer,
    Camera,
    FilePath,
    FileTransfer,
    FileTransferObject,
    QRScanner,
    PhotoViewer,
    SignaturePadModule,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
