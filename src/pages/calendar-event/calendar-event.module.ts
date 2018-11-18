import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarEventPage } from './calendar-event';

@NgModule({
  declarations: [
    CalendarEventPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarEventPage),
  ],
})
export class CalendarEventPageModule {}
