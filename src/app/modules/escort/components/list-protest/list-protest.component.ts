import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-list-protest',
  templateUrl: './list-protest.component.html',
  styleUrls: ['./list-protest.component.scss'],
})
export class ListProtestComponent implements OnInit {

  @Input('scope') scope: string;
  @Input('media_uuid') media_uuid: string;
  @Input('personData') personData: any;
  @Input('limit') limit: number;

  isLoadingInit: boolean = false;
  isRefresh: boolean = false;
  protests: any;
  listProtests: any;
  nextUrl: string;
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
    this.loadProtests();

    this.events.subscribe('refreshProtestListEvent', (data) => {
      this.loadProtests();
    });
  }

  loadProtests(): any {
    if (this.personData && this.scope === 'private') {
      this.getProtests({'status': this.statusValue});
    } else {
      this.getProtests({});
    }
  }

  statusChange(event: any): any {
    this.statusValue = +event.target.value;
    this.getProtests({'status': this.statusValue})
  }

  getProtests(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;
    const creator_uuid = context.creator_uuid;
    const status = context.status;

    if (!event) {
      this.isLoadingInit = true;
    }

    let params = {}
    if (creator_uuid) params['creator_uuid'] = creator_uuid;
    if (this.media_uuid) params['media_uuid'] = this.media_uuid;
    if (nextUrl) params['nextUrl'] = nextUrl;
    if (status) params['status'] = status;
    if (this.limit) params['limit'] = this.limit;

    this.escortService.getProtests(params)
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
          this.protests = response;
          this.nextUrl = this.protests.navigate.next;

          const results = this.protests.results;

          if (event) {
            this.listProtests.push(...results);
          } else {
            this.listProtests = results;
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
      this.getProtests({'nextUrl': this.nextUrl, 'event': event});
    } else {
      event.target.disabled = true;
    }
  }

  toDetailProtest(uuid: string, media_uuid: string): any {
    this.router.navigate(['/media', media_uuid, 'protest', uuid]);
  }

}
