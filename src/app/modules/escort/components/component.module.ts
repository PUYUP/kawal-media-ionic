import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ListMediaComponent } from './list-media/list-media.component';
import { ListRatingComponent } from './list-rating/list-rating.component';
import { SubmitProtestComponent } from './submit-protest/submit-protest.component';
import { ListProtestComponent } from './list-protest/list-protest.component';
import { DetailProtestComponent } from './detail-protest/detail-protest.component';

import { ListCommentComponent } from './list-comment/list-comment.component';
import { DetailCommentComponent } from './detail-comment/detail-comment.component';
import { SubmitCommentComponent } from './submit-comment/submit-comment.component';

import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';

// CKEditor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Modules
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ListMediaComponent,
    ListRatingComponent,
    SubmitProtestComponent,
    ListProtestComponent,
    DetailProtestComponent,
    ListCommentComponent,
    DetailCommentComponent,
    SubmitCommentComponent,
    EditAttributeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SharedModule,
    CKEditorModule
  ],
  entryComponents: [
    ListMediaComponent,
    ListRatingComponent,
    SubmitProtestComponent,
    ListProtestComponent,
    DetailProtestComponent,
    ListCommentComponent,
    DetailCommentComponent,
    SubmitCommentComponent,
    EditAttributeComponent
  ],
  exports: [
    ListMediaComponent,
    ListRatingComponent,
    SubmitProtestComponent,
    ListProtestComponent,
    DetailProtestComponent,
    ListCommentComponent,
    DetailCommentComponent,
    SubmitCommentComponent,
    EditAttributeComponent
  ]
})
export class ComponentModule { }
