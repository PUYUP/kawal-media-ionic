import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscortRoutingModule } from './escort-routing.module';
import { SubmitMediaPageModule } from './pages/submit-media/submit-media.module';
import { ListMediaPageModule } from './pages/list-media/list-media.module';
import { DetailMediaPageModule } from './pages/detail-media/detail-media.module';
import { ListRatingPageModule } from './pages/list-rating/list-rating.module';
import { ListProtestPageModule } from './pages/list-protest/list-protest.module';
import { SubmitProtestPageModule } from './pages/submit-protest/submit-protest.module';
import { DetailProtestPageModule } from './pages/detail-protest/detail-protest.module';
import { DetailCommentPageModule } from './pages/detail-comment/detail-comment.module';
import { ListCommentPageModule } from './pages/list-comment/list-comment.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EscortRoutingModule,
    SubmitMediaPageModule,
    ListMediaPageModule,
    DetailMediaPageModule,
    ListRatingPageModule,
    ListProtestPageModule,
    SubmitProtestPageModule,
    DetailProtestPageModule,
    DetailCommentPageModule,
    ListCommentPageModule
  ]
})
export class EscortModule { }
