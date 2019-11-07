import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ListNotificationComponent } from './list-notification/list-notification.component';

// Modules
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ListNotificationComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
  ],
  entryComponents: [
    ListNotificationComponent
  ],
  exports: [
    ListNotificationComponent
  ]
})
export class ComponentModule { }
