import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, Events } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';
import { PersonService } from '../../../person/services/person.service';

// Component
import { SubmitMediaComponent } from '../../components/submit-media/submit-media.component';

@Component({
  selector: 'app-detail-media',
  templateUrl: './detail-media.page.html',
  styleUrls: ['./detail-media.page.scss'],
})
export class DetailMediaPage implements OnInit {
  
  uuid: string;
  mediaData: any;
  personData: any;
  attributeData: any;
  isLoading: boolean = false;
  isRefresh: boolean = false;
  actionSheet: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public events: Events,
    public router: Router,
    public modalController: ModalController,
    private personService: PersonService,
    private escortService: EscortService) { }

  async presentActionSheet() {
    this.actionSheet = await this.actionSheetController.create({
      header: 'Tindakan',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Sunting',
          icon: 'create',
          handler: () => {
            this.router.navigate(['/media', this.mediaData.uuid, 'edit'], { replaceUrl: false });
          }
        }, {
          text: 'Batal',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            // Pass
          }
        }
      ]
    });

    await this.actionSheet.present();
  }

  ngOnInit() {
    this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.personData = this.personService.getLocalToken();
    this.getMedia();

    this.events.subscribe('editMediaEvent', (data) => {
      this.mediaData.label = data.label;
    });
  }

  actionSheetOpen(): any {
    this.presentActionSheet();
  }

  getMedia(): any {
    this.isLoading = true;
    this.escortService.getMedia(this.uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;

          // Load attributes
          if (this.mediaData) {
            this.getAttributes();
          }
        })
      )
      .subscribe(
        response => {
          this.mediaData = response;

          // Only fire on refresh
          if (this.isRefresh) {
            this.events.publish('refreshMediaEvent', this.mediaData);
          }
        },
        failure => {
          // Error
        }
      );
  }

  getAttributes(): any {
    const params = {
      'identifiers': 'redaction,description,website',
      'entity_index': 0,
      'entity_uuid': this.mediaData.uuid,
    }

    this.escortService.getAttributes(params)
    .pipe(
      finalize(() => {
        // Pass
      })
    )
    .subscribe(
      (response: any) => {
        this.attributeData = response;
      },
      (failure: any) => {
        // Pass
      }
    )
  }

  refreshPage(): any {
    this.isRefresh = true;
    this.getMedia();
  }

}
