import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { ExpandableLayout3Module } from '../../components/list-view/expandable/layout-3/expandable-layout-3.module'

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    ExpandableLayout3Module
  ],
})
export class EventsPageModule {}
