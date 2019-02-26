import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChapterEventsPage } from './chapter-events';

@NgModule({
  declarations: [
    ChapterEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChapterEventsPage),
  ],
})
export class ChapterEventsPageModule {}
