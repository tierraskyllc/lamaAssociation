import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChapterAddPage } from './chapter-add';

@NgModule({
  declarations: [
    ChapterAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ChapterAddPage),
  ],
})
export class ChapterAddPageModule {}
