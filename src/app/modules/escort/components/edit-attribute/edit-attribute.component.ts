import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EscortService } from '../../services/escort.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss'],
})
export class EditAttributeComponent implements OnInit {

  @Input('attributeData') attributeData: any;
  @Input('entityData') entityData: any;

  isLoading: boolean = false;
  createFormGroup: any = FormGroup;
  updatedAttributeData: any;
  
  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    private escortService: EscortService) { }

  ngOnInit() {
    this.createForm();
  }

  /***
   * Initialize form
   */
  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      value: ['', [Validators.required]]
    });
  }

  textareaLoaded(event: any): any {
    setTimeout(() => {
      event.target.getElementsByTagName('textarea').item(0).style.height = 'auto';

      if (this.attributeData && this.attributeData.value.object) {
        this.createFormGroup.patchValue({
          value: this.attributeData.value.object,
        });
      }
    }, 100);
  }

  onSubmit(): any {
    this.isLoading = true;

    const params = {
      'uuid': this.attributeData.uuid,
      'entity_index': 0,
      'entity_uuid': this.entityData.uuid,
      'value': this.createFormGroup.value.value,
    }

    // Edit
    if (this.attributeData && this.attributeData.value.uuid) {
      params['value_uuid'] = this.attributeData.value.uuid;
    }

    this.escortService.postPartialUpdateAttribute(params)
    .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response:any) => {
          this.updatedAttributeData = response;
          this.dismiss(true);
        }
      );
  }

  dismiss(dismisSubmitAction: boolean = false): any {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    return this.modalController.dismiss({
      'dismissed': true,
      'data': this.updatedAttributeData,
      'value': dismisSubmitAction ? this.createFormGroup.value.value : null,
    });
  }

}
