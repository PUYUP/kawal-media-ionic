import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ToastController, Events } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-submit-rating',
  templateUrl: './submit-rating.component.html',
  styleUrls: ['./submit-rating.component.scss'],
})
export class SubmitRatingComponent implements OnInit {

  @Input('mediaData') mediaData: any;
  @Input('ratingData') ratingData: any;

  createFormGroup: any = FormGroup;
  isLoading: boolean = false;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public router: Router,
    public events: Events,
    private escortService: EscortService) { }
  
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

            this.router.navigate(['/profile'], navigationExtras).then(() => {
              this.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(header: string, msg: string) {
    const toast = await this.toastController.create({
      header: header,
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.createForm();
  }

  textareaLoaded(event: any): any {
    setTimeout(() => {
      event.target.getElementsByTagName('textarea').item(0).style.height = 'auto';

      if (this.ratingData) {
        this.createFormGroup.patchValue({
          score: this.ratingData.score,
          description: this.ratingData.description,
        });
      }
    }, 100);
  }

  /***
   * Initialize form
   */
  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      score: ['', [Validators.required]],
      media: [this.mediaData.uuid, [Validators.required]],
      description: ['', []],
    });
  }

  formSubmit(): any {
    this.isLoading = true;
    let actionable: any;

    if (this.ratingData) {
      // Update
      actionable = this.escortService.patchUpdateRating(this.createFormGroup.value, this.ratingData.uuid);
    } else {
      // Create
      actionable = this.escortService.postSubmitRating(this.createFormGroup.value);
    }

    actionable.pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: { uuid: any; }) => {
          // Close modal
          this.dismiss();

          // Initial ratings
          const stars = [1, 2, 3, 4, 5];
          const ratings = this.mediaData.ratings;

          // Calculate based on star given
          const score = +this.createFormGroup.value.score;
          const prevScore = +ratings[score];
          const newScore = prevScore + 1;

          // Set rating again
          this.mediaData.ratings[score] = newScore;

          // Update rating count
          if (!this.ratingData) {
            const prevCount = +this.mediaData.rating_count;
            const newCount = prevCount + 1;
          
            // Set count again
            this.mediaData.rating_count = newCount;
          }

          // Count average
          let totalRating = 0;
          let totalScore = 0;
          let average = 0;

          for (let star of stars) {
            const value = ratings[star];
            const ratingTimes = value * star;
            totalRating += ratingTimes;
            totalScore += value;
          }

          average = totalRating / totalScore;
          this.mediaData.ratings.score_avg = average;

          // Push to detail media
          this.events.publish('editRatingEvent', this.mediaData);

          if (!this.ratingData) {
            this.router.navigate(['/media', this.mediaData.uuid, 'rating']); 
          } else {
            this.ratingData.score = this.createFormGroup.value.score;
            this.ratingData.description = this.createFormGroup.value.description;
          }
        },
        (failure: { error: any; status: number; }) => {
          if (failure.error && failure.status === 403) {
            const error: any = failure.error;
            this.presentAlertPrompt();
          }

          if (failure.error && failure.status === 400) {
            if ('non_field_errors' in failure.error) {
              // Close modal
              this.dismiss().then(() => {
                this.presentToast('Kesalahan', 'Anda sudah memberikan rating.');
                this.router.navigate(['/media', this.mediaData.uuid, 'rating']);
              });
            }
          }
        }
      );
  }

  dismiss(): any {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    return this.modalController.dismiss({
      'dismissed': true
    });
  }

}
