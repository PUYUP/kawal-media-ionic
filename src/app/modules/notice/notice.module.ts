import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeRoutingModule } from './notice-routing.module';
import { ListNotificationPageModule } from './pages/list-notification/list-notification.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NoticeRoutingModule,
    ListNotificationPageModule
  ]
})
export class NoticeModule { }
