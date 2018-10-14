import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChapterPage } from './add-chapter';

@NgModule({
  declarations: [
    AddChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(AddChapterPage),
  ],
})
export class AddChapterPageModule {}
