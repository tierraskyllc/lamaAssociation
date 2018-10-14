import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageChaptersPage } from './manage-chapters';

@NgModule({
  declarations: [
    ManageChaptersPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageChaptersPage),
  ],
})
export class ManageChaptersPageModule {}
