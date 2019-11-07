import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StarRatingModule } from 'ionic4-star-rating';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PersonModule } from './modules/person/person.module';
import { EscortModule } from './modules/escort/escort.module';
import { UploaderModule } from './modules/uploader/uploader.module';
import { KnowledgeBaseModule } from './modules/knowledgebase/knowledgebase.module';
import { NoticeModule } from './modules/notice/notice.module';

import { PersonRoutingModule } from './modules/person/person-routing.module';
import { EscortRoutingModule } from './modules/escort/escort-routing.module';
import { KnowledgeBaseRoutingModule } from './modules/knowledgebase/knowledgebase-routing.module';
import { NoticeRoutingModule } from './modules/notice/notice-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    PersonRoutingModule,
    EscortRoutingModule,
    KnowledgeBaseRoutingModule,
    NoticeRoutingModule,
    AppRoutingModule,
    PersonModule,
    EscortModule,
    UploaderModule,
    KnowledgeBaseModule,
    NoticeModule,
    StarRatingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
