import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageApplicationsPage } from './manage-applications';

@NgModule({
  declarations: [
    ManageApplicationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageApplicationsPage),
  ],
})
export class ManageApplicationsPageModule {}
