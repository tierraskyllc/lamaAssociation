import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageMeetingsPage } from './manage-meetings';

@NgModule({
  declarations: [
    ManageMeetingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageMeetingsPage),
  ],
})
export class ManageMeetingsPageModule {}
