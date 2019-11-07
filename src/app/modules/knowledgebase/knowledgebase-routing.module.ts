import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListArticlePage } from './pages/list-article/list-article.page';
import { DetailArticlePage } from './pages/detail-article/detail-article.page';

const routes: Routes = [
  {
    path: 'information',
    children: [
      {
        path: '',
        component: ListArticlePage
      },
      {
        path: ':article_uuid',
        children: [
          {
            path: '',
            component: DetailArticlePage
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowledgeBaseRoutingModule { }
