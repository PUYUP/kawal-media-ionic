import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

// SERVICES
import { PersonService } from '../../../person/services/person.service';

@Component({
  selector: 'app-list-rating',
  templateUrl: './list-rating.page.html',
  styleUrls: ['./list-rating.page.scss'],
})
export class ListRatingPage implements OnInit {

  mediaData: any;
  isLoading: boolean = false;

  constructor(
    public events: Events) { }

  ngOnInit() {
    this.isLoading = true;
  }

  refreshPage(): any {
    this.events.publish('refreshRatingEvent', {'isRefresh': true});
  }

  getMediaData(event: any) {
    this.isLoading = false;
    this.mediaData = event;
  }

}
