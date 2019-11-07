import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowledgeBaseRoutingModule } from './knowledgebase-routing.module';
import { ListArticlePageModule } from './pages/list-article/list-article.module';
import { DetailArticlePageModule } from './pages/detail-article/detail-article.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    KnowledgeBaseRoutingModule,
    ListArticlePageModule,
    DetailArticlePageModule
  ]
})
export class KnowledgeBaseModule { }
