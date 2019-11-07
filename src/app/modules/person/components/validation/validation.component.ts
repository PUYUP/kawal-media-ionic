import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// Services
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {

  @Input('personData') personData: any;

  validationData: any;
  newValidationData: any;
  initLoading: boolean = false;
  attributeValue: any = {};
  
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private personService: PersonService) { }

  ngOnInit() {
    if (this.personData) {
      this.getValidations();
    }
  }

  /***
  * Prompt request change
  */
  async presentConfirmPrompt(data: any) {
    const alert = await this.alertController.create({
      header: 'Tindakan Diperlukan',
      backdropDismiss: false,
      keyboardClose: false,
      message: data.instruction,
      inputs: [
        {
          name: 'secure_code',
          type: 'text',
          placeholder: 'Kode Otentikasi',
        }
      ],
      buttons: [
        {
          text: (data.method == 1 ? 'Batal' : 'Ok'),
          role: 'cancel',
          handler: () => {
            // Pass
          }
        }, {
          text: 'Konfirmasi',
          handler: (alertData: any) => {
            const secureCode = alertData.secure_code;
            this.validateAction(secureCode, data);
            return false;
          }
        }
      ]
    });

    await alert.present().then(() => {
      if (data.new_value) {
        if (data.method === 1) {
          // Auto validation by email with secure code
          this.requestSecureCode(data);
        }

        // Update the value
        if (data.value.object != data.new_value) {
          this.updateValidationValue(data);
        }
      }
    });
  }

  /***
   * Show toast message
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 5000
    });

    toast.present();
  }

  getValidations(): any {
    this.initLoading = true;

    const params = {
      'identifiers': 'phone,email',
      'person_uuid': this.personData.uuid,
    }

    this.personService.getValidations(params)
    .pipe(
      finalize(() => {
        this.initLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.validationData = response;

        for (let index in this.validationData) {
          const item = this.validationData[index];
          const verified = item.value.verified;
          const key = item.identifier;
          const value = item.value.object;
      
          this.attributeValue[key] = value;

          // Append faked verified
          this.validationData[index].value.fake_verified = verified;
        }
      },
      (failure: any) => {
        // Pass
      }
    )
  }

  requestValidation(data: any): any {
    let value = this.attributeValue[data.identifier]
    let index = this.validationData.findIndex((x: { identifier: string; }) => x.identifier === data.identifier);
    
    data.new_value = value;

    if (value) {
      if (this.validationData[index].value.fake_verified) {
        this.presentToast('Sudah divalidasi.');
      } else {
        this.presentConfirmPrompt(data);
      }
    } else {
      this.presentToast('Tidak boleh kosong.');
    }
  }

  /***
   * Special access need secure code
   * This send a secure code to user
   */
  requestSecureCode(attribute: any): any {
    attribute.action = 'request_secure_code';
    attribute.method = 1; // use email

    if (attribute.identifier === 'email') {
      attribute.new_value = this.attributeValue['email'];
    }

    this.personService.requestSecureCode(attribute)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          // Pass
        },
        (failure: any) => {
          // Passed
        }
      );
  }

  updateValidationValue(data: any): any {
    let params = {
      'uuid': data.uuid, // Attribute uuid
      'value': data.new_value,
    }

    let value_uuid = (data.value.uuid ? data.value.uuid : (this.newValidationData ? this.newValidationData.uuid : ''));

    if (value_uuid) {
      // Update
      params['value_uuid'] = value_uuid;
    }

    this.personService.updateValidation(params)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          this.newValidationData = response;
        },
        (failure: any) => {
          // Passed
        }
      );
  }

  validateAction(secure_code: string, data: any): any {
    const params = {
      'uuid': data.uuid, // Attribute uuid
      'secure_code': secure_code,
      'value': data.new_value,
      'value_uuid': (data.value.uuid ? data.value.uuid : (this.newValidationData ? this.newValidationData.uuid : '')),
    }

    this.personService.updateValidation(params)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          let index = this.validationData.findIndex((x: { identifier: string; }) => x.identifier === data.identifier);
          this.validationData[index].value.fake_verified = true;

          this.presentToast('Validasi berhasil!');
          this.alertController.dismiss();
        },
        (failure: any) => {
          const error = failure.error;
          let errorString = 'Terjadi kesalahan tak terduga. Coba lagi.';
      
          if (error.detail) {
            errorString = error.detail;
          }

          this.presentToast(errorString);
        }
      );
  }

  valueTyping(event: any, identifier: string, keyword: string): any {
    const index = this.validationData.findIndex((x: { identifier: string; }) => x.identifier === identifier);
    const verified = this.validationData[index].value.verified;

    if (keyword == this.validationData[index].value.object && verified) {
      this.validationData[index].value.fake_verified = true;
    } else {
      this.validationData[index].value.fake_verified = false;
    }
  }

}
