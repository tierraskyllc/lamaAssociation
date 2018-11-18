import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CalendarDayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar-day',
  templateUrl: 'calendar-day.html',
})
export class CalendarDayPage {

  data: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data.selecteddate = navParams.get('selecteddate');
    this.data.items = navParams.get('items');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarDayPage');
  }

  openEvent(type, id) {
    if(type === 'event') {
      this.navCtrl.push("CalendarEventPage", { lama_events_id: id });
    }
    if(type === 'meeting') {
      this.navCtrl.push("CalendarMeetingPage", { lama_meetings_id: id });
    }
  }

}
