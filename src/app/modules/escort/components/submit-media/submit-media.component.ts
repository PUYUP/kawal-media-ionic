import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, Events } from '@ionic/angular';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-submit-media',
  templateUrl: './submit-media.component.html',
  styleUrls: ['./submit-media.component.scss'],
})
export class SubmitMediaComponent implements OnInit {

  @Output('mediaDataOutput') mediaDataOutput = new EventEmitter();
  
  createFormGroup: any = FormGroup;
  publications: any;
  isLoading: boolean = false;
  isLoadingInit: boolean = false;
  listeds: any;
  listedsList: any;
  media: any;
  mediaData: any;
  failure: any;
  mediaListed: boolean = false;
  searchLoading: boolean = false;
  media_uuid: string;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public events: Events,
    private escortService: EscortService) {
  }

  /***
   * Prompt alert
   */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Tindakan Ditolak',
      message: 'Akun Anda belum divalidasi.',
      backdropDismiss: false,
      keyboardClose: false,
      buttons: [
        {
          text: 'Validasi Sekarang',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              replaceUrl: true,
              state: {
                segment: 'validation'
              }
            };

            this.router.navigate(['/profile'], navigationExtras);
          }
        }
      ]
    });

    await alert.present();
  }

  /***
   * Prompt not allowed alert
   */
  async presentAlertNotAllowedPrompt() {
    const alert = await this.alertController.create({
      header: 'Tindakan Ditolak',
      message: 'Akun Anda belum divalidasi.',
      backdropDismiss: false,
      keyboardClose: false,
      buttons: [
        {
          text: 'Validasi Sekarang',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              replaceUrl: true,
              state: {
                segment: 'validation'
              }
            };

            this.router.navigate(['/profile'], navigationExtras);
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    // Media uuid from url
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');

    this.getPublication();
    this.createForm();

    // Edit
    if (this.media_uuid) {
      this.getMedia();
    }
  }

  createForm(): any {
    this.createFormGroup = this.formBuilder.group({
      label: ['', Validators.required],
      publication: ['', Validators.required]
    });
  }

  searchMedia(term: any) {
    this.searchLoading = true;
    this.escortService.getMedias({'term': term, 'match': 1, limit: 5})
      .pipe(
        finalize(() => {
          this.searchLoading = false;
        })
      )
      .subscribe(
        response => {
          this.listeds = response;

          if (this.listeds.count > 0) {
            this.listedsList = this.listeds.results;
            this.mediaListed = true;
            this.listedsList = this.listedsList.map((e: { label: any; }) => e.label).join(', ');
          }
        },
        failure => {
          // Error
        }
      );
  }

  searchMediaAction(value: string): any {
    let mediaLabel = '';
    if (this.mediaData) mediaLabel = this.mediaData.label;

    if (mediaLabel.toLocaleLowerCase() != value.toLocaleLowerCase()) {
      this.searchMedia(value);
    } else {
      this.mediaListed = false;
    }
  }

  getPublication(): any {
    this.escortService.getConstants({'constant': 'publication'})
    .pipe(
      finalize(() => {
        // Pass
      })
    )
    .subscribe(
      (response: any) => {
        this.publications = response;
      },
      (failuer: any) => {
        // Pass
      }
    )
  }

  getMedia(): any {
    this.isLoading = true;
    this.escortService.getMedia(this.media_uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          this.mediaData = response;

          // Send to parent component
          this.mediaDataOutput.emit(this.mediaData);

          // Set value
          this.createFormGroup.patchValue({
            label: this.mediaData.label,
            publication: this.mediaData.publication
          });
        },
        failure => {
          // Error
        }
      );
  }

  onSubmit(): any {
    this.isLoading = true;
    let actionable: any;

    // Enyity index must defined
    // 0 = Media
    this.createFormGroup.value.entity_index = 0;

    if (this.mediaData) {
      // Update
      actionable = this.escortService.patchUpdateMedia(this.createFormGroup.value, this.mediaData.uuid);
    } else {
      // Create
      actionable = this.escortService.postSubmitMedia(this.createFormGroup.value);
    }

    actionable.pipe(
      finalize(() => {
        this.isLoading = false;
        this.createFormGroup.markAsPristine();
      })
    )
    .subscribe(
      (response: any) => {
        if (this.mediaData) {
          this.events.publish('editMediaEvent', this.createFormGroup.value);
        }

        this.router.navigate(['/media', response.uuid], { replaceUrl: true });
      },
      (failure: any) => {
        this.failure = failure;

        if (this.failure.status == '406' || this.failure.status == '403') {
          setTimeout(() => {
            this.presentAlertNotAllowedPrompt();
          }, 50);
        }
      }
    )
  }

}
