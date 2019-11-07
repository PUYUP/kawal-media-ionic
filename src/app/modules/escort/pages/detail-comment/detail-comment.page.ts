import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-detail-comment',
  templateUrl: './detail-comment.page.html',
  styleUrls: ['./detail-comment.page.scss'],
})
export class DetailCommentPage implements OnInit {

  media_uuid: string;
  protest_uuid: string;
  comment_uuid: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public events: Events) { }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.protest_uuid = this.activatedRoute.snapshot.paramMap.get('protest_uuid');
    this.comment_uuid = this.activatedRoute.snapshot.paramMap.get('comment_uuid');
  }

  refreshPage(): void {
    this.events.publish('refreshCommentListEvent', {});
  }

}
