import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageMembersPage } from './manage-members';

@NgModule({
  declarations: [
    ManageMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageMembersPage),
  ],
})
export class ManageMembersPageModule {}
