import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageChapterPage } from './manage-chapter';

@NgModule({
  declarations: [
    ManageChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageChapterPage),
  ],
})
export class ManageChapterPageModule {}
