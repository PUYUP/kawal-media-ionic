import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Events, ModalController, AlertController, IonContent } from '@ionic/angular';
import { of, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';

// Component
import { SubmitCommentComponent } from '../submit-comment/submit-comment.component';

@Component({
  selector: 'app-component-list-comment',
  templateUrl: './list-comment.component.html',
  styleUrls: ['./list-comment.component.scss'],
})
export class ListCommentComponent implements OnInit {

  @Input('depth') depth: number;
  @Output('protestDataOutput') protestDataOutput = new EventEmitter();
  @Output('mediaProtestUUIDOutput') mediaProtestUUIDOutput: any = new EventEmitter();
  @ViewChild('commentForm', {static: false}) commentForm: ElementRef;
  @Inject(DOCUMENT) document: any;

  media_uuid: string;
  comment_uuid: string;
  protest_uuid: string;
  notified_uuid: string;
  nextUrl: string;
  isLoadingInit: boolean = false;
  protestData: any;
  comments: any;
  listComments: any;
  singleCommentData: any;
  commentParams: any;
  isReplyTo: boolean = false;
  replyToData: any;
  modal: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    public alertController: AlertController,
    public ionContent: IonContent,
    public router: Router,
    public events: Events,
    private escortService: EscortService) { }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.comment_uuid = this.activatedRoute.snapshot.paramMap.get('comment_uuid');
    this.protest_uuid = this.activatedRoute.snapshot.paramMap.get('protest_uuid');
    this.notified_uuid = this.activatedRoute.snapshot.paramMap.get('notified_uuid');

    this.commentParams = {
      'protest_uuid': this.protest_uuid,
      'parent_uuid': this.comment_uuid,
      'notified_uuid': this.notified_uuid,
    }

    // Send to list-comment page
    this.mediaProtestUUIDOutput.emit({'protest_uuid': this.protest_uuid, 'media_uuid': this.media_uuid});

    // Init loading comment
    // Include Protest
    this.initProtests();

    // Capture event refresh page
    this.events.subscribe('refreshCommentListEvent', (data) => {
      this.isLoadingInit = true;
      this.getComments(this.commentParams);
    });

    // Capture data from submit comment
    this.events.subscribe('commentPostEvent', (data) => {
      this.singleCommentData = data.commentData;

      const isEditOnDetail = data.isEditOnDetail;

      // If new comment, append to list
      if (!data.isEdit) this.listComments.unshift(this.singleCommentData);

      // Prevent comment appear in other list page
      if (this.depth == 0) {
        this.listComments = this.listComments.filter((obj: any) => {
          return obj.parent == null;
        });
      }

      // Update data
      if (data.isEdit && !isEditOnDetail) {
        let index = this.listComments.findIndex((x: { uuid: string; }) => x.uuid === this.singleCommentData.uuid);
        if (this.listComments[index]) {
          this.listComments[index].description = this.singleCommentData.description;
        }
      }

      // Reset reply-to
      this.isReplyTo = false;
      delete this.replyToData;
    });
  }

  async addCommentModal(commentData: any) {
    this.modal = await this.modalController.create({
      component: SubmitCommentComponent,
      componentProps: {
        'protestData': this.protestData,
        'commentDataInit': commentData,
        'isReply': commentData.is_reply,
        'isEdit': commentData.is_edit,
      }
    });

    return await this.modal.present();
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

  initProtests(): any {
    let getProtest = (this.protest_uuid ? this.escortService.getProtest(this.protest_uuid) : of(null));
    let getComments = (this.protest_uuid ? this.escortService.getComments(this.commentParams) : of(null));
    
    return forkJoin([getProtest, getComments])
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;

          if (this.notified_uuid) {
            setTimeout(() => {
              const notifiedElement = document.getElementById(this.notified_uuid);
              this.ionContent.scrollToPoint(0, notifiedElement.offsetTop);
            }, 50);
          }
        })
      )
      .subscribe(([protestData, comments]) => {
        this.protestData = protestData;
        this.protest_uuid = this.protestData.uuid;

        this.comments = comments;
        this.listComments = this.comments.results;
        this.nextUrl = this.comments.navigate.next;

        this.protestDataOutput.emit(this.protestData);
        this.events.publish('loadedProtestEvent', this.protestData);
      });
  }

  getComments(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;

    let params = {
      'protest_uuid': this.protest_uuid,
      'parent_uuid': this.comment_uuid,
      'notified_uuid': this.notified_uuid,
      'nextUrl': nextUrl
    }

    this.escortService.getComments(params)
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
          this.comments = response;
          this.nextUrl = this.comments.navigate.next;

          const results = this.comments.results;

          if (event) {
            this.listComments.push(...results);
          } else {
            this.listComments = results;
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
      this.commentParams['nextUrl'] = this.nextUrl;
      this.commentParams['event'] = event;

      this.getComments(this.commentParams);
    } else {
      event.target.disabled = true;
    }
  }

  editItem(data: any): void {
    data.is_edit = true;
    this.addCommentModal(data);
  }

  deleteItem(data: any): any {
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
          this.listComments = this.listComments.filter(function( obj: any ) {
            return obj.uuid !== data.uuid;
          });
        },
        (failure: any) => {
          // Error
        }
      );
  }

  replyItem(data: any): void {
    data.is_reply = true;

    if (data.reply_count) {
      this.router.navigate(['/media', this.protestData.media, 'protest', this.protestData.uuid, 'comment', data.uuid]);
    } else {
      this.addCommentModal(data);
    }
  }

  replyTo(data: any): any {
    this.isReplyTo = true;
    this.replyToData = data;

    this.protestData.is_reply_to = this.isReplyTo;
    this.protestData.reply_to_comment = data.uuid;
    this.protestData.reply_for_person = data.commenter_uuid;

    let formElement = this.commentForm;
    let top = formElement.nativeElement.getBoundingClientRect().top;

    this.ionContent.scrollToPoint(0, top);
  }

  cancelReplyTo(): void {
    this.isReplyTo = false;
    delete this.replyToData;
  }

}
