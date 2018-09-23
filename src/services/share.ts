import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import { Http } from "@angular/http";
import { AlertController } from 'ionic-angular';
import { LoadingController, Loading, Platform, ToastController } from 'ionic-angular'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

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

  constructor(private http: Http, 
    private alertCtrl: AlertController, 
    public actionSheetCtrl: ActionSheetController, 
    public loadingCtrl: LoadingController,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    public toastCtrl: ToastController,
    private transfer: FileTransfer
  ) {
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
    var tmpbuttons = [];
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
          tmpbuttons = [];
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
            if(tmparr[i] == 'Manage Meetings (SignIn)') {
              tmphandler = () => {
                //myNavCtrl.push("Meeting (SignIn)Page");
                myNavCtrl.push("ManageMeetingsPage");
                console.log('Manage Meetings (SignIn)' + ' clicked');
              }
            }
            if(tmparr[i] == 'Manage Events (SignIn)') {
              tmphandler = () => {
                //myNavCtrl.push("Meeting (SignIn)Page");
                myNavCtrl.push("ManageEventsPage");
                console.log('Manage Events (SignIn)' + ' clicked');
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
              this.logout(myNavCtrl);
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

  logout(navCtrl) {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();
    var body = new FormData();
    body.append('sessionid', this.sessionid);
    this.http.post(this.server + "logout/logout.php", body).subscribe(
      data => {
        this.curentpage = 'LoginPage';
        this.sessionid = '';
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.role = '';
        this.loading.dismissAll();
        this.presentMessageOnlyAlert('Thank you for using LAMA app.  You have successfully loged out.');
        navCtrl.pop();
        //navCtrl.push("LoginPage", { data: 'Thank you for using LAMA app.  You have successfully loged out.' });
      },
      error => {
        this.curentpage = 'LoginPage';
        this.sessionid = '';
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.role = '';
        this.loading.dismissAll();
        this.presentMessageOnlyAlert('Thank you for using LAMA app.  You have successfully loged out.');
        navCtrl.pop();
        //navCtrl.push("LoginPage", { data: 'Thank you for using LAMA app.  You have successfully loged out.' });
      }
    );
  }

  public displayPic(picfilename: string, picviewtitle: string) {
    this.loading = this.loadingCtrl.create({
      content: '',
    });
    this.loading.present();

    var body = new FormData();
    body.append('sessionid', this.sessionid);
    body.append('docname', picfilename);
    this.http.post(this.server + "docdownload/tempsession.php", body).subscribe(
      data => {
        var decoded_response = JSON.parse(data["_body"]);
        if(decoded_response[0] == "true") {
          var docurl = this.server + "docdownload/downloaddoc.php?temporaryshortsessionid=" + decoded_response[1] + "&docname=" + picfilename;
            this.photoViewer.show(docurl, picviewtitle, {share: false});
            this.loading.dismissAll();
          }
          else {
            this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
            console.log("Unknown problem occured.  Please contact administrator.  Code: SP-128");
            this.loading.dismissAll();
          }
      },
      error => {
        this.presentMessageOnlyAlert("Unknown problem occured.  Please contact administrator.");
        console.log("Unknown problem occured.  Please contact administrator.  Code: SP-129");
        this.loading.dismissAll();
      }
    );
  }

  public takePicture(partofpicfilename) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if(this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(partofpicfilename), imagePath);
            /*returnfilename = this.copyFileToLocalDir(correctPath, currentName, this.createFileName(partofpicfilename));
            lastimagefullpath = correctPath + currentName;
            this.picuploadinterval = setInterval(() => {
              if(this.hasCopyFinished == true) {
                return this.uploadImage(this.returnfilename, lastimagefullpath);
              }
            },2000);*/
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(partofpicfilename), imagePath);
        /*returnfilename = this.copyFileToLocalDir(correctPath, currentName, this.createFileName(partofpicfilename));
        lastimagefullpath = imagePath;
        this.picuploadinterval = setInterval(() => {
          if(this.hasCopyFinished == true) {
            return this.uploadImage(this.returnfilename, lastimagefullpath);
          }
        },2000);*/
      }
    }, (err) => {
      this.presentToast('Error while selecting image.' + err);
      return '';
    });
  }

  // Create a new name for the image
  private createFileName(partofpicfilename: string) {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  this.username + '_' + partofpicfilename + '_' + n + ".jpg";
    this.presentMessageOnlyAlert('newFileName: ' + newFileName);
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, imagePath) {
    this.presentMessageOnlyAlert('namePath: ' + namePath);
    this.presentMessageOnlyAlert('currentName: ' + currentName);
    this.presentMessageOnlyAlert('newFileName: ' + newFileName);
    this.presentMessageOnlyAlert('imagePath: ' + imagePath);
    this.presentMessageOnlyAlert('dataDirectory: ' + this.file.dataDirectory);
    //this.presentToast('1');
    var fullpath = '';
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      //this.presentToast('2');
      if(this.platform.is('android')) {
        //this.presentToast('3');
        fullpath = namePath + currentName;
      }
      else {
        //this.presentToast('4');
        fullpath = imagePath;
      }
      return this.uploadImage(newFileName, fullpath);
    }, error => {
      //this.presentToast('5');
      console.log('Error while storing file.  This error can be safely ignored.');
      return '';
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 10000,
      position: 'top'
    });
    toast.present();
  }

  public uploadImage(filename: string, fullpath: string) {
    //this.presentToast('6');
    //this.presentToast('filename: ' + filename);
    //this.presentToast('fullpath: ' + fullpath);
    if((filename != "") && (fullpath != "")) {
      var url = this.server + "application/upload.php";
    
      // File for Upload
      var targetPath = this.pathForImage(filename);
    
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'sessionid': this.sessionid}
      };
    
      const fileTransfer: FileTransferObject = this.transfer.create();
    
      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();
    
      // Use the FileTransfer to upload the image
      fileTransfer.upload(fullpath, url, options).then((data) => {
        this.loading.dismissAll();
        this.presentToast('Image succesful uploaded.');
        return filename;
      }, (err) => {
        filename = '';
        this.loading.dismissAll();
        this.presentToast('Error while uploading image(s).');
        return filename;
      });
    }
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

}
