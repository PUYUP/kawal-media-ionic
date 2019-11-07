import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListNotificationPage } from './pages/list-notification/list-notification.page';

const routes: Routes = [
  {
    path: 'notification',
    children: [
      {
        path: '',
        component: ListNotificationPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeRoutingModule { }
