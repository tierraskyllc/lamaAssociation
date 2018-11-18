import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarDayPage } from './calendar-day';

@NgModule({
  declarations: [
    CalendarDayPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarDayPage),
  ],
})
export class CalendarDayPageModule {}
