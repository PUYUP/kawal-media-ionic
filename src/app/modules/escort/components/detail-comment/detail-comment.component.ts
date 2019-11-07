import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Events } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';
import { of, forkJoin } from 'rxjs';
import { SubmitCommentComponent } from '../submit-comment/submit-comment.component';

@Component({
  selector: 'app-component-detail-comment',
  templateUrl: './detail-comment.component.html',
  styleUrls: ['./detail-comment.component.scss'],
})
export class DetailCommentComponent implements OnInit {

  media_uuid: string;
  protest_uuid: string;
  comment_uuid: string;
  isLoadingInit: boolean = false;
  commentData: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public modalController: ModalController,
    private events: Events,
    private router: Router,
    private escortService: EscortService) { }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.protest_uuid = this.activatedRoute.snapshot.paramMap.get('protest_uuid');
    this.comment_uuid = this.activatedRoute.snapshot.paramMap.get('comment_uuid');

    this.getComment();

    // Capture data from submit comment
    this.events.subscribe('commentPostEvent', (data) => {
      const isEditOnDetail = data.isEditOnDetail;

      if (isEditOnDetail) {
        this.commentData = data.commentData;
      }
    });
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

  async addCommentModal(commentData: any) {
    const modal = await this.modalController.create({
      component: SubmitCommentComponent,
      componentProps: {
        'commentDataInit': commentData,
        'isReply': commentData.is_reply,
        'isEdit': commentData.is_edit,
        'protestUUID': commentData.protestUUID,
      }
    });

    return await modal.present();
  }

  getComment(): any {
    this.escortService.getComment(this.comment_uuid)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe((response: any) => {
        this.commentData = response;
      }, (failure: any) => {

      })
  }

  deleteItem(data: any): void {
    setTimeout(() => {
      this.presentAlertConfirm(data);
    }, 50);
  }

  performDelete(data: any): any {
    this.escortService.deleteComment(data)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          this.router.navigate(['/media', this.media_uuid, 'protest', this.protest_uuid, 'comment']);
        },
        (failure: any) => {
          // Error
        }
      );
  }

  editItem(data: any): void {
    data.is_edit = true;
    data.protestUUID = this.protest_uuid;
    this.addCommentModal(data);
  }

}
