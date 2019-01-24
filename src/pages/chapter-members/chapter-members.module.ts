import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChapterMembersPage } from './chapter-members';

@NgModule({
  declarations: [
    ChapterMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(ChapterMembersPage),
  ],
})
export class ChapterMembersPageModule {}
