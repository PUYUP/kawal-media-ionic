import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-list-comment',
  templateUrl: './list-comment.page.html',
  styleUrls: ['./list-comment.page.scss'],
})
export class ListCommentPage implements OnInit {

  media_uuid: string;
  protest_uuid: string;
  protestData: any;

  constructor(
    public events: Events) { }

  ngOnInit() {
  }

  getMediaProtestUUID(event: any) {
    this.media_uuid = event.media_uuid;
    this.protest_uuid = event.protest_uuid;
  }

  getProtestData(event: any): any {
    this.protestData = event;
  }

  refreshPage(): void {
    this.events.publish('refreshCommentListEvent', {});
  }

}
