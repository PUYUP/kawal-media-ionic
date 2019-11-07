import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Events, AlertController } from '@ionic/angular';

// CKEditor
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Services
import { EscortService } from '../../services/escort.service';
import { PersonService } from '../../../person/services/person.service';

// Component environment
import { modulenv } from '../../environment';
import { UploadAdapter } from './upload-adapter';

@Component({
  selector: 'app-component-submit-protest',
  templateUrl: './submit-protest.component.html',
  styleUrls: ['./submit-protest.component.scss'],
})
export class SubmitProtestComponent implements OnInit {

  @Output() protestDataOutput = new EventEmitter();
  
  isLoading: boolean = false;
  isSubmitLoading: boolean = false;
  media_uuid: string;
  protest_uuid: string;
  createFormGroup: any = FormGroup;
  classicEditor: any;
  protestDraft: any;
  saveInit: boolean = false;
  protestData: any;
  attachmentUrl: any;
  configEditor: any;
  uploadParams: any;
  isShowEditor: boolean = true;
  failure: any;

  purpose = [
    {'id': 1, 'label': 'Tidak Benar'},
    {'id': 2, 'label': 'Kritik dan Saran'},
    {'id': 3, 'label': 'Diskusi'},
  ]

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router,
    public events: Events,
    public alertController: AlertController,
    private personService: PersonService,
    private escortService: EscortService) { }

  ngOnInit() {
    this.media_uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.protest_uuid = this.activatedRoute.snapshot.paramMap.get('protest_uuid');
    this.attachmentUrl = modulenv.attachmentUrl;

    const data = this.personService.getLocalToken();

    this.uploadParams = {
      uploadUrl: this.attachmentUrl,
      entity_index: 5,
      headers: {
        'Authorization': data ? data.auth_code : ''
      },
    }

    this.classicEditor = ClassicEditor;
    this.configEditor = {
      image: {
        toolbar: [ 
          'imageTextAlternative', '|', 
          'imageStyle:full', 
          'imageStyle:side', 
          'imageStyle:alignLeft', 
          'imageStyle:alignCenter', 
          'imageStyle:alignRight' 
        ],
        styles: [
            'full',
            'side',
            'alignLeft',
            'alignCenter',
            'alignRight'
        ]
      }
    };

    this.createForm();

    // Check allow edit or not
    // If it's new, ignore this
    if (this.protest_uuid) {
      this.getProtest();
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

  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      label: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    // Detect form changes if not edit
    if (!this.protest_uuid) {
      this.createFormGroup.valueChanges.subscribe((data: any) => {
        this.initAsDraft();
        this.saveInit = true;
      });
    }
  }

  onSubmit(): any {
    this.updated();
  }

  initAsDraft(): any {
    if (!this.saveInit) {
      this.createFormGroup.value.media_uuid = this.media_uuid;
      this.createFormGroup.value.purpose = 3;
      this.createFormGroup.value.label = 'Draft';
      this.createFormGroup.value.description = '<p>Sanggahan...</p>';

      this.escortService.postProtest(this.createFormGroup.value)
      .pipe(
          finalize(() => {
            // Pass
          })
        )
        .subscribe(
          (response: { uuid: any; }) => {
            this.protestDraft = response;
            this.protest_uuid = this.protestDraft.uuid;
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

  updated(): any {
    if (this.protest_uuid) {
      this.isSubmitLoading = true;
      this.createFormGroup.value.uuid = this.protest_uuid;
      this.createFormGroup.value.media_uuid = this.media_uuid;

      this.escortService.updateProtest(this.createFormGroup.value)
      .pipe(
          finalize(() => {
            this.createFormGroup.markAsPristine();
            this.isSubmitLoading = false;
          })
        )
        .subscribe(
          (response: { uuid: any; }) => {
            this.events.publish('editProtestEvent', response);
            this.router.navigate(['/media', this.media_uuid, 'protest', response.uuid], { replaceUrl: true });
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
          this.protest_uuid = this.protestData.uuid;
          
          this.createFormGroup.patchValue({
            label: this.protestData.label,
            purpose: this.protestData.purpose,
            description: this.protestData.description,
          });

          // Is ownership allow edit
          if (this.protestData && !this.protestData.ownership) {
            this.isShowEditor = false;
          }

          // Send to parent component
          this.protestDataOutput.emit(response);
        },
        (failure: any) => {
          // Error
        }
      );
  }

  onReady(eventData: any): any {
    eventData.plugins.get('FileRepository').createUploadAdapter = (loader: { file: any; }) => {
      this.uploadParams.entity_uuid = this.protest_uuid;
      return new UploadAdapter(loader, this.uploadParams);
    };
  }

}
