import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentModule } from '../../components/component.module';

import { ListArticlePage } from './list-article.page';

const routes: Routes = [
  {
    path: '',
    component: ListArticlePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListArticlePage]
})
export class ListArticlePageModule {}
