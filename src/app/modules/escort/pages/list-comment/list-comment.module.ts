import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListCommentPage } from './list-comment.page';

import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: ListCommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListCommentPage]
})
export class ListCommentPageModule {}
