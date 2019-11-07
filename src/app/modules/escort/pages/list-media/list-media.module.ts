import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ListMediaPage } from './list-media.page';

// Modules
import { SharedModule } from '../../../shared/shared.module';
import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: ListMediaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentModule
  ],
  declarations: [
    ListMediaPage
  ]
})
export class ListMediaPageModule {}
