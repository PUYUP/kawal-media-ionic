import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-list-media',
  templateUrl: './list-media.component.html',
  styleUrls: ['./list-media.component.scss'],
})
export class ListMediaComponent implements OnInit {

  @Input('scope') scope: string;
  @Input('personData') personData: any;
  @Input('limit') limit: number;

  isLoadingSearch: boolean = false;
  isLoadingInit: boolean = false;
  medias: any;
  listMedias: any;
  currentPage: number = 0;
  nextUrl: string;
  nextPage: number = 0;
  searchTerm: string;
  statusValue: number = 3;
  status: Array<any> = [
    {'status': 1, 'label': 'Tertunda'},
    {'status': 2, 'label': 'Ditinjau'},
    {'status': 3, 'label': 'Terbit'},
    {'status': 4, 'label': 'Dikembalikan'},
    {'status': 5, 'label': 'Ditolak'},
    {'status': 6, 'label': 'Konsep'}
  ]

  constructor(
    public events: Events,
    public router: Router,
    private escortService: EscortService) { }

  ngOnInit() {
    this.loadMedias();

    this.events.subscribe('refreshPageEvent', (data) => {
      this.loadMedias();
    });

    this.events.subscribe('refreshGlobalEvent', (data) => {
      this.loadMedias();
    });
  }

  loadMedias(): any {
    if (this.personData && this.scope === 'private') {
      this.getMedias({'status': this.statusValue});
    } else {
      this.getMedias({});
    }
  }

  statusChange(event: any): any {
    this.statusValue = +event.target.value;
    this.getMedias({'status': this.statusValue})
  }

  searchMediaInput(event: any): any {
    const term = event.target.value;
    this.searchTerm = term;
    this.getMedias({'action': 'search'});
  }

  getMedias(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;
    const action = context.action;
    const status = context.status;

    if (this.searchTerm || action === 'search') {
      this.isLoadingSearch = true;
    } else {
      if (!nextUrl) this.isLoadingInit = true;
    }

    let params = {'match': ''}
  
    if (this.searchTerm) params['term'] = this.searchTerm;
    if (this.limit) params['limit'] = this.limit;
    if (nextUrl) params['nextUrl'] = nextUrl;
    if (status) params['status'] = status;

    this.escortService.getMedias(params)
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;
          this.isLoadingSearch = false;

          if (event) {
            event.target.complete();
          }
        })
      )
      .subscribe(
        response => {
          this.medias = response;
          const results = this.medias.results;

          if (this.medias.navigate) {
            this.nextUrl = this.medias.navigate.next;
          }

          if (event) {
            this.listMedias.push(...results);
          } else {
            this.listMedias = results;
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
      this.getMedias({'nextUrl': this.nextUrl, 'event': event});
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

  toDetail(uuid: string): any {
    this.router.navigate(['/media', uuid]);
  }

}
