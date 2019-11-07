import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailCommentPage } from './detail-comment.page';

import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: DetailCommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailCommentPage]
})
export class DetailCommentPageModule {}
