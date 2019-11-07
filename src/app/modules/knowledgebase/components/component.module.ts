import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ListArticleComponent } from './list-article/list-article.component';
import { DetailArticleComponent } from './detail-article/detail-article.component';


// Modules
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ListArticleComponent,
    DetailArticleComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SharedModule
  ],
  entryComponents: [
    ListArticleComponent,
    DetailArticleComponent
  ],
  exports: [
    ListArticleComponent,
    DetailArticleComponent
  ]
})
export class ComponentModule { }
