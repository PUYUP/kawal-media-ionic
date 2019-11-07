import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentModule } from '../../components/component.module';

import { DetailArticlePage } from './detail-article.page';

const routes: Routes = [
  {
    path: '',
    component: DetailArticlePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailArticlePage]
})
export class DetailArticlePageModule {}
