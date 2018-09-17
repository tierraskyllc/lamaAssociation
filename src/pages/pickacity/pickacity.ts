import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular'

/**
 * Generated class for the PickacityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pickacity',
  templateUrl: 'pickacity.html',
})
export class PickacityPage {

  data: any = {};
  loading: Loading;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.data.cities = navParams.get('cities');
    this.data.selectedcity = '';
    this.data.myloadingcontroller = navParams.get('myloadingcontroller');
  }

  ionViewWillLoad() {
    /*this.loading = this.loadingCtrl.create({
      content: '',
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickacityPage');
    //this.loading.dismissAll();
    //this.data.myloadingcontroller.dismissAll();
  }

  ngAfterViewInit() {
    this.data.myloadingcontroller.dismissAll();
  }

  dismiss() {
    let data = { 'selectedcity': this.data.selectedcity };
    this.viewCtrl.dismiss(data);
  }

  selectMe(citynmae: String) {
    this.data.selectedcity=citynmae;
    this.dismiss();
  }

}
