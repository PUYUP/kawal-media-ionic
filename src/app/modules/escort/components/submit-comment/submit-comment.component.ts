import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Events, AlertController } from '@ionic/angular';

// Services
import { EscortService } from '../../services/escort.service';
import { PersonService } from '../../../person/services/person.service';

@Component({
  selector: 'app-component-submit-comment',
  templateUrl: './submit-comment.component.html',
  styleUrls: ['./submit-comment.component.scss'],
})
export class SubmitCommentComponent implements OnInit {

  @Input('protestData') protestData: any;
  @Input('commentDataInit') commentDataInit: any;
  @Input('isEdit') isEdit: boolean;
  @Input('inListComment') inListComment: boolean;
  @Input('isReply') isReply: boolean;
  @Input('protestUUID') protestUUID: string;

  @ViewChild('textareaComment', {static: false, read: ElementRef}) textareaCommentView: ElementRef;

  createFormGroup: any = FormGroup;
  isSubmitLoading: boolean = false;
  failure: any;
  commentData: any;
  comment_uuid: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router,
    public events: Events,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private personService: PersonService,
    private escortService: EscortService) { }

  ngOnInit() {
    this.createForm();

    this.events.subscribe('loadedProtestEvent', (data) => {
      this.protestData = data;
    });

    this.comment_uuid = this.activatedRoute.snapshot.paramMap.get('comment_uuid');
    if (this.comment_uuid) {
      this.isReply = true;
    }
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

  textareaLoaded(event: any): any {
    setTimeout(() => {
      event.target.getElementsByTagName('textarea').item(0).style.height = 'auto';

      // Comment data init, so this is edit action
      if (this.commentDataInit && !this.isReply) {
        this.createFormGroup.patchValue({
          description: this.commentDataInit.description,
        });
      }
    }, 100);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength]]
    });
  }

  onSubmit(): any {
    this.isSubmitLoading = true;
    
    // Edit from comment detail
    if (this.protestUUID) {
      this.createFormGroup.value.protest_uuid = this.protestUUID;
    } else {
      this.createFormGroup.value.protest_uuid = this.protestData.uuid;
      this.createFormGroup.value.reply_to_comment = this.protestData.reply_to_comment;
      this.createFormGroup.value.reply_for_person = this.protestData.reply_for_person;
    }

    // Add parent if reply
    // This from modal form
    if (this.isReply && this.commentDataInit) this.createFormGroup.value.parent_uuid = this.commentDataInit.uuid;

    // This from detail comment page, inline form
    if (this.isReply && this.comment_uuid) this.createFormGroup.value.parent_uuid = this.comment_uuid;

    let actionable: any;

    if (this.commentDataInit && this.isEdit) {
      // Update
      this.createFormGroup.value.comment_uuid = this.commentDataInit.uuid;
      actionable = this.escortService.updateComment(this.createFormGroup.value);
    } else {
      // Create
      actionable = this.escortService.postComment(this.createFormGroup.value);
    }

    actionable.pipe(
      finalize(() => {
        this.isSubmitLoading = false;
        this.createFormGroup.reset();
        this.createFormGroup.markAsPristine();

        if (!this.inListComment) {
          this.dismiss();
        }

        // Reset reply-to
        delete this.protestData.reply_to_comment;
        delete this.protestData.reply_for_person;
      }) 
    )
    .subscribe(
      (response: { uuid: any; }) => {
        this.commentData = response;

        // Update protest data
        if (!this.commentDataInit && !this.isReply) {
          const commentCount = +this.protestData.comment_count;
          this.protestData.comment_count = commentCount + 1;
        }

        this.events.publish('commentPostEvent', {
          'commentData': this.commentData,
          'protestData': this.protestData,
          'isEdit': this.isEdit,
          'isEditOnDetail': this.protestUUID ? true : false,
        });
        
        if (!this.protestData.reply_for_person && !this.isEdit) {
          // Go list comment
          if (!this.inListComment && !this.isReply) {
            this.router.navigate(['/media', this.protestData.media, 'protest', this.protestData.uuid, 'comment']);
          }

          // Go to detail comment
          if (!this.inListComment && this.isReply) {
            this.router.navigate(['/media', this.protestData.media, 'protest', this.protestData.uuid, 'comment', this.commentDataInit.uuid]);
          }
        }
      },
      (failure: { error: any; status: number; }) => {
        this.failure = failure;

        if (this.failure.status == '406' || this.failure.status == '403') {
          setTimeout(() => {
            this.presentAlertNotAllowedPrompt();
          }, 50);
        }
      }
    );
  }

}
