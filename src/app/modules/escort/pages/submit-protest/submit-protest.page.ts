import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submit-protest',
  templateUrl: './submit-protest.page.html',
  styleUrls: ['./submit-protest.page.scss'],
})
export class SubmitProtestPage implements OnInit {

  protest_uuid: string;
  media_uuid: string;
  protestData: any;
  title: string = 'Kirim Sanggahan';

  constructor(
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.media_uuid = params.get('uuid')
      this.protest_uuid = params.get('protest_uuid');

      if (this.protest_uuid) {
        this.title = 'Sunting Sanggahan';
      }
    });
  }

  getProtestData(event: any): any {
    this.protestData = event;

    if (this.protestData && !this.protestData.ownership) {
      this.title = 'Akses Ditolak';
    }
  }

}
