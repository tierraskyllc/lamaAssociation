import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OdometerFormPage } from './odometer-form';

@NgModule({
  declarations: [
    OdometerFormPage,
  ],
  imports: [
    IonicPageModule.forChild(OdometerFormPage),
  ],
})
export class OdometerFormPageModule {}
