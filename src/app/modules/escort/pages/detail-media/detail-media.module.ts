import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'ionic4-star-rating';

import { DetailMediaPage } from './detail-media.page';
import { DetailMediaComponent } from '../../components/detail-media/detail-media.component';
import { UploaderModule } from '../../../uploader/uploader.module';

import { SubmitRatingComponent } from '../../components/submit-rating/submit-rating.component';

// Modules
import { SharedModule } from '../../../shared/shared.module';

// Component modules
import { ComponentModule } from '../../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: DetailMediaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    RouterModule.forChild(routes),
    SharedModule,
    UploaderModule,
    ComponentModule
  ],
  exports: [
    SubmitRatingComponent
  ],
  declarations: [
    DetailMediaPage,
    DetailMediaComponent,
    SubmitRatingComponent
  ],
  entryComponents: [
    SubmitRatingComponent,
  ]
})
export class DetailMediaPageModule {}
