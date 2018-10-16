import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChapterPage } from './add-chapter';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    AddChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(AddChapterPage),
    IonicSelectableModule
  ],
})
export class AddChapterPageModule {}
