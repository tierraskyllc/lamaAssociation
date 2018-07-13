import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ManageApplicationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-applications',
  templateUrl: 'manage-applications.html',
})
export class ManageApplicationsPage {

  data: any = {};

  searchTerm: string = '';
  searchTimer: any;
  items: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.items = [
      [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted'], [1, 'Vishal Gandhi','07-01-2018','Pending'], [2, 'Rafael Alix','07-10-2018','Review'], [3, 'Newark President','07-15-2018','Accepted']
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageApplicationsPage');
  }

  search() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {      
      //console.log('timer');
      this.searchApplications();
      },1500);
  }

  searchApplications() {
    console.log(this.searchTerm);
  }

}
