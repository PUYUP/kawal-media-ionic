import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ListRatingPage } from './list-rating.page';
import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: ListRatingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentModule
  ],
  declarations: [
    ListRatingPage
  ]
})
export class ListRatingPageModule {}
