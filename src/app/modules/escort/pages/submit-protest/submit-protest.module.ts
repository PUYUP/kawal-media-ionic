import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SubmitProtestPage } from './submit-protest.page';
import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: SubmitProtestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentModule
  ],
  declarations: [SubmitProtestPage]
})
export class SubmitProtestPageModule {}
