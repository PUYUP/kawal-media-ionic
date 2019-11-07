import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Events } from '@ionic/angular';

// Services
import { PersonService } from '../../../person/services/person.service';
import { EscortService } from '../../services/escort.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: 'list-protest.page.html',
  styleUrls: ['list-protest.page.scss']
})
export class ListProtestPage implements OnInit {
  
  segment: string = 'public';
  isLoading: boolean = false;
  media_uuid: string;
  mediaData: any;
  personData: any;

  constructor(
    public events: Events,
    public activatedRoute: ActivatedRoute,
    private personService: PersonService,
    private escortService: EscortService) {
    
  }

  ngOnInit() {
    this.personData = this.personService.getLocalToken();

    this.activatedRoute.paramMap.subscribe(params => {
      this.media_uuid = params.get('uuid')
    });

    if (this.media_uuid) {
      this.getProtest();
    }
  }

  segmentChanged(event: any): any {
    this.segment = event.detail.value;
  }

  refreshPage(): void {
    this.events.publish('refreshProtestListEvent', {});
  }

  getProtest(): any {
    this.isLoading = true;

    this.escortService.getMedia(this.media_uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        this.mediaData = response;
      });
  }

}
