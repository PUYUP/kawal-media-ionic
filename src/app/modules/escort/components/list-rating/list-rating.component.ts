import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Events, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

// Components
import { SubmitRatingComponent } from '../submit-rating/submit-rating.component';

// Services
import { EscortService } from '../../services/escort.service';
import { PersonService } from '../../../person/services/person.service';

@Component({
  selector: 'app-component-list-rating',
  templateUrl: './list-rating.component.html',
  styleUrls: ['./list-rating.component.scss'],
})
export class ListRatingComponent implements OnInit {

  @Output('mediaDataOutput') mediaDataOutput = new EventEmitter();

  media_uuid: string;
  personData: any;
  ratings: any;
  listRatings: any;
  mediaData: any;
  nextUrl: string;
  isLoadingInit: boolean = false;
  isRefresh: boolean = false;

  constructor(
    public events: Events,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    private escortService: EscortService,
    private personService: PersonService) { }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: SubmitRatingComponent,
      componentProps: {
        'mediaData': this.mediaData,
        'ratingData': this.ratings.my_rating,
      }
    });

    return await modal.present();
  }

  sendRating(): any {
    this.presentModal();
  }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.personData = this.personService.getLocalToken();

    this.initRatings();

    this.events.subscribe('refreshRatingEvent', (data) => {
      this.isRefresh = data.isRefresh;
      this.getRatings({});
    });
  }

  initRatings(): any {
    const ratingParams = {'media_uuid': this.media_uuid}

    let getMedia = (this.media_uuid ? this.escortService.getMedia(this.media_uuid) : of(null));
    let getRatings = (this.media_uuid ? this.escortService.getRatings(ratingParams) : of(null));
    
    return forkJoin([getMedia, getRatings])
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;
        })
      )
      .subscribe(([mediaData, ratings]) => {
        this.mediaData = mediaData;
        this.media_uuid = this.mediaData.uuid;

        this.ratings = ratings;
        this.listRatings = this.ratings.results;
        this.nextUrl = this.ratings.navigate.next;

        this.mediaDataOutput.emit(this.mediaData);
      });
  }

  getRatings(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;

    let params = {
      'media_uuid': this.media_uuid,
      'nextUrl': nextUrl
    }

    this.escortService.getRatings(params)
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;

          if (event) {
            event.target.complete();
          }
        })
      )
      .subscribe(
        response => {
          this.ratings = response;
          const results = this.ratings.results;

          if (event) {
            this.listRatings.push(...results);
          } else {
            this.listRatings = results;
          }

          // Done! No more page
          if (!this.nextUrl && event) {
            event.target.disabled = true;
          }
        },
        failure => {
          // Error
        }
      );
  }

  loadNextData(event: any): any {
    if (this.nextUrl) {
      this.getRatings({'nextUrl': this.nextUrl, 'event': event});
    } else {
      event.target.disabled = true;
    }
  }

  createRange(number: number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

}
