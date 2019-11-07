import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

// SERVICES
import { PersonService } from '../../../person/services/person.service';

@Component({
  selector: 'app-list-media',
  templateUrl: './list-media.page.html',
  styleUrls: ['./list-media.page.scss'],
})
export class ListMediaPage implements OnInit {

  personData: any;
  segment: string = 'public';

  constructor(
    public events: Events,
    private personService: PersonService) { }

  ngOnInit() {
    this.personData = this.personService.getLocalToken();
  }

  segmentChanged(event: any): any {
    this.segment = event.detail.value;
  }

  refreshPage(): any {
    this.events.publish('refreshPageEvent', {});
  }

}
