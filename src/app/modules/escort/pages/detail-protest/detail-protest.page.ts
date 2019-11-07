import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-protest',
  templateUrl: './detail-protest.page.html',
  styleUrls: ['./detail-protest.page.scss'],
})
export class DetailProtestPage implements OnInit {

  media_uuid: string;

  constructor(
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.media_uuid = params.get('uuid')
    });
  }

}
