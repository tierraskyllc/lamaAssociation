import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-chapter-add',
  templateUrl: 'chapter-add.html',
})
export class ChapterAddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChapterAddPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
