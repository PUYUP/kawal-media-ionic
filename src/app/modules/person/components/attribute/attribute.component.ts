import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

// File upload
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})
export class AttributeComponent implements OnInit {

  @Input('personData') personData: any;

  createFormGroup: any;
  uploader: FileUploader = new FileUploader({});
  hasImage: boolean = true;

  initLoading: boolean = false;
  isLoading: boolean = false;
  basicAttributes: any;
  attributes: any;
  baseProfile: any = ['biography', 'avatar', 'gender', 'hobbies']
  avatarObj: any;
  toast: any;

  constructor(
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private personService: PersonService) { }
  
  /***
   * Show toast message
   */
  async presentToast(message: string) {
    this.toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 2000
    });

    this.toast.present();
  }

  ngOnInit() {
    this.getAttributes(this.baseProfile);
    this.uploadAction();
    this.personData = this.personService.credentials;
  }

  getAttributes(identifiers: any): any {
    this.initLoading = true;
    this.personService.getAttributes({ identifiers: identifiers })
      .pipe(
        finalize(() => {
          this.initLoading = false;
        })
      )
      .subscribe(
        response => {
          this.attributes = response;
          this.avatarObj = this.attributes.find((obj: { identifier: string; }) => obj.identifier == 'avatar');

          // Remove avatar field
          this.attributes = this.attributes.filter(function (obj: { identifier: string; }) {
            return obj.identifier !== 'avatar';
          });

          // Clear form without file field
          this.createForm(this.attributes);
        },
        failure => {
          // Error
        }
      );
  }

  createForm(attributes: any): void {
    let fieldControl = new FormGroup({});

    for (let item of attributes) {
      const identifier = item.identifier;
      const type = item.field_type;
      const value_obj = item.value;
      let values = value_obj.object;

      // Multiple select (checkbox)
      // Is an array form control!
      if (type === 'multi_option') {
        const formArray = new FormArray([]);
        const optionGroups = item.option_group;

        // Append dynamic formControl
        for (let opt of optionGroups) {
          let value = values.find((e: any) => e === opt.id);
          let field = new FormControl()

          // Set value here
          if (value) {
            field.setValue(opt.id);
          }

          // Set validators
          if (value_obj.required === true) {
            field.setValidators([Validators.required]);
          }

          // Now append to formArray
          formArray.push(field)
        }

        // Create the control
        fieldControl.addControl(identifier, formArray);
      }

      // Text, option, and other
      if (type !== 'multi_option') {
        // Add validation here!
        if (type === 'option' && (values == null || values == undefined)) values = '-1';
        let field = new FormControl(values, []);

        // Set validators
        if (value_obj.required === true) {
          field.setValidators([Validators.required]);
        }

        // Telephone only number
        if (identifier === 'telephone') {
          field.setValidators([
            Validators.required,
            Validators.pattern('[0-9]*'),
            Validators.minLength(10),
            Validators.maxLength(14)
          ]);
        }

        fieldControl.addControl(identifier, field);
      }
    }

    // Call on template...
    this.createFormGroup = fieldControl;
  }

  uploadAction(): any {
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.hasImage = true;
    }
  }

  onSubmit(): any {
    let fieldValues = this.createFormGroup.value;

    // Ekstract start...
    for (let opt of this.attributes) {
      const type = opt.field_type;
      const identifier = opt.identifier;

      // We need real value not 'true' or 'false'
      // Of course for multiple option only
      if (type === 'multi_option') {
        const option_group = opt.option_group;
        let values = fieldValues[identifier]
        let values_list = [];

        // Grab index in selected checkbox
        const indexs = values.map((value: any, index: any) => {
          if (value) return index;
        });
        
        // From this indexs grab the value from option_group
        for (let index of indexs) {
          const v = option_group[index];
          if (v) values_list.push(v.id);
        }

        fieldValues[identifier] = values_list;
      }
    }

    // Valid...
    if (this.createFormGroup.valid && this.personData) {
      this.submitAction(fieldValues);
    }
  }

  submitAction(values: any): any {
    this.isLoading = true;
    values.uuid = this.personData.uuid;

    this.personService.postUpdateAttribute(values)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Show notification...
          this.presentToast('Menyimpan berhasil.');
        },
        failure => {
          this.presentToast('Gagal menyimpan.');
        }
      );
  }

}
