import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickacityPage } from './pickacity';

@NgModule({
  declarations: [
    PickacityPage,
  ],
  imports: [
    IonicPageModule.forChild(PickacityPage),
  ],
})
export class PickacityPageModule {}
