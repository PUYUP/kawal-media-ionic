import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-media',
  templateUrl: './submit-media.page.html',
  styleUrls: ['./submit-media.page.scss'],
})
export class SubmitMediaPage implements OnInit {

  mediaData: any;
  title: string;

  constructor() { }

  ngOnInit() {
    this.title = "Kirim Media";
  }

  getMediaData(event: any): any {
    this.mediaData = event;

    if (this.mediaData) {
      this.title = "Sunting Media";
    }

    if (this.mediaData && !this.mediaData.ownership) {
      this.title = 'Akses Ditolak';
    }
  }

}
