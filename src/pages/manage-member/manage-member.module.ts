import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageMemberPage } from './manage-member';

@NgModule({
  declarations: [
    ManageMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageMemberPage),
    TextMaskModule
  ],
})
export class ManageMemberPageModule {}
