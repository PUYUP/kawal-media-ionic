import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UploaderModule } from '../../../uploader/uploader.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProfilePage } from './profile.page';

import { AttributeComponent } from '../../components/attribute/attribute.component';
import { SecurityComponent } from '../../components/security/security.component';
import { ValidationComponent } from '../../components/validation/validation.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes),
    UploaderModule
  ],
  declarations: [
    ProfilePage,
    AttributeComponent,
    SecurityComponent,
    ValidationComponent
  ],
  entryComponents: [
    AttributeComponent,
    SecurityComponent,
    ValidationComponent
  ],
})
export class ProfilePageModule {}
