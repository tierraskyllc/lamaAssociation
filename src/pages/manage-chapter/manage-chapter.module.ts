import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageChapterPage } from './manage-chapter';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ManageChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageChapterPage),
    IonicSelectableModule
  ],
})
export class ManageChapterPageModule {}
