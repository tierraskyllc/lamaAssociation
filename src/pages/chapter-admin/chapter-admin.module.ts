import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChapterAdminPage } from './chapter-admin';

@NgModule({
  declarations: [
    ChapterAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(ChapterAdminPage),
  ],
})
export class ChapterAdminPageModule {}
