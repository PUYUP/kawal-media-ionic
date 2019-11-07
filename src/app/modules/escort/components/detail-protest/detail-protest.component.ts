import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Events, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';
import { PersonService } from '../../../person/services/person.service';

// Component
import { SubmitCommentComponent } from '../submit-comment/submit-comment.component';

@Component({
  selector: 'app-component-detail-protest',
  templateUrl: './detail-protest.component.html',
  styleUrls: ['./detail-protest.component.scss'],
})
export class DetailProtestComponent implements OnInit {

  media_uuid: string;
  protest_uuid: string;
  loading: any;
  isLoading: boolean = false;
  protestData: any;
  content: any;
  
  constructor(
    public events: Events,
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toastController: ToastController,
    public router: Router,
    private location: Location,
    private escortService: EscortService,
    private personService: PersonService,
    protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.protest_uuid = this.activatedRoute.snapshot.paramMap.get('protest_uuid');

    this.getProtest();

    this.events.subscribe('editProtestEvent', (data) => {
      this.getProtest();
    });

    this.events.subscribe('commentPostEvent', (data) => {
      this.protestData = data.protestData;
    });
  }

  async addCommentModal() {
    const modal = await this.modalController.create({
      component: SubmitCommentComponent,
      componentProps: {
        'protestData': this.protestData,
      }
    });
  
    return await modal.present();
  }

  async presentAlertConfirm(data: any) {
    const alert = await this.alertController.create({
      header: 'Apakah Yakin?',
      message: 'Tindakan tidak bisa dikembalikan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            // Pass
          }
        }, {
          text: 'Hapus',
          handler: () => {
            this.performDelete(data);
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
    });

    return await this.loading.present();
  }

  getProtest(): any {
    this.isLoading = true;
    this.escortService.getProtest(this.protest_uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.protestData = response;
          this.content = this.sanitizer.bypassSecurityTrustHtml(this.protestData.description);
        },
        (failure: any) => {
          // Error
        }
      );
  }
  
  deleteItem(data: any): any {
    setTimeout(() => {
      this.presentAlertConfirm(data);
    }, 50);
  }

  performDelete(data: any): any {
    this.presentLoading();

    this.escortService.deleteProtest(data)
      .pipe(
        finalize(() => {
          this.loading.dismiss();
        })
      )
      .subscribe(
        (response: any) => {
          this.events.publish('refreshProtestListEvent', data);
          this.location.back();
        },
        (failure: any) => {
          // Error
        }
      );
  }

  performThumb(data: any, thumb: number): any {
    data.entity_index = 5; // 5 = Protest
    data.entity_uuid = this.protestData.uuid;
    data.thumbed_uuid = this.protestData.thumbing_uuid;
    data.thumbing = +thumb;

    // Must login
    if (this.personService.isAuthenticated()) {
      // New thumbs here
      // Create new object
      if (this.protestData.thumbing_uuid === null) {
        this.escortService.postThumb(data)
          .pipe(
            finalize(() => {
              // Pass
            })
          )
          .subscribe(
            (response: any) => {
              this.protestData.thumbing_uuid = response.uuid;

              const tdown = +this.protestData.thumbsdown_count;
              const tup = +this.protestData.thumbsup_count;

              if (data.thumbing == 1) {
                this.protestData.thumbing = true;
                this.protestData.thumbsup_count = tup + 1;
              }

              if (data.thumbing == 0) {
                this.protestData.thumbing = false;
                this.protestData.thumbsdown_count = tdown + 1;
              }
            },
            (failure: any) => {
              this.protestData.thumbing = null;

              setTimeout(() => {
                this.presentAlertNotAllowedPrompt();
              }, 50);
            }
          );
      }

      // User has thumbed
      // Update object
      if (this.protestData.thumbing_uuid && (data.thumbing == 1 || data.thumbing == 0)) {
        this.escortService.updateThumb(data)
          .pipe(
            finalize(() => {
              // Pass
            })
          )
          .subscribe(
            (response: any) => {
              const tdown = +this.protestData.thumbsdown_count;
              const tup = +this.protestData.thumbsup_count;

              if (this.protestData.thumbing == 1 && tdown) {
                this.protestData.thumbsdown_count = tdown - 1;
                this.protestData.thumbsup_count = tup + 1;
              }

              if (this.protestData.thumbing == 0 && tup) {
                this.protestData.thumbsup_count = tup - 1;
                this.protestData.thumbsdown_count = tdown + 1;
              }
            },
            (failure: any) => {
              this.protestData.thumbing = null;
            }
          );
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /***
   * Show modal comment
   */
  addComment(data: any): any {
    if (data.comment_count > 0) {
      this.router.navigate(['/media', data.media, 'protest', data.uuid, 'comment']);
    } else {
      this.addCommentModal();
    }
  }

}
