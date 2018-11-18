import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarMeetingPage } from './calendar-meeting';

@NgModule({
  declarations: [
    CalendarMeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarMeetingPage),
  ],
})
export class CalendarMeetingPageModule {}
