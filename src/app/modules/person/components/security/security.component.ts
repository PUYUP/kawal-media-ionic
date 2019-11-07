import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {

  @Input('personData') personData: any;
  @ViewChildren('basicInput') basicInput: QueryList<ElementRef>;

  createFormGroup: any;
  initLoading: boolean = false;
  isLoading: boolean = false;
  isSaveLoading: boolean = false;
  basicLoading: boolean = false;
  indexEdited: any;
  hasBasicProfiles: boolean = false;
  basicProfiles: any;
  secureCode: any;
  oldValue: any;
  toast: any;
  alert: any;
  editValue: any = [];
  profileData: any = [];
  errorString: any;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    private personService: PersonService) { }

  /***
   * Show toast message
   */
  async presentToast(message: string) {
    this.toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 5000
    });

    this.toast.present();
    delete this.errorString;
  }

  ngOnInit() {
    if (this.personData) {
      this.getBasicProfile();
    }
  }

  /***
  * Prompt request change
  */
  async presentConfirmPrompt(attribute: any, index: any) {
    this.alert = await this.alertController.create({
      header: 'Tindakan Diperlukan',
      backdropDismiss: false,
      keyboardClose: false,
      message: 'Kode otentikasi dikirim. Periksa kotak masuk email Anda.',
      inputs: [
        {
          name: 'secure_code',
          type: 'text',
          placeholder: 'Kode Otentikasi',
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            this.editValue[index] = this.profileData[index].value;
            this.indexEdited = 999999;
          }
        }, {
          text: 'Konfirmasi',
          handler: (alertData) => {
            const secureCode = alertData.secure_code;
            this.validateAction(secureCode, attribute, index);
            return false;
          }
        }
      ]
    });

    await this.alert.present().then(() => {
      this.requestSecureCode(attribute);
    });
  }

  getBasicProfile(): any {
    this.basicLoading = true;
    this.personService.getBasicProfile(this.personData.uuid)
      .pipe(
        finalize(() => {
          this.basicLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.basicProfiles = response;

          for (let key in this.basicProfiles) {
            let label = key.replace('_', ' ').replace('-', ' ');
            let field_type = 'text';

            if (key === 'email') field_type = 'email';
            
            if (key === 'username' || key === 'email') {
              this.profileData.push({
                'label': label,
                'identifier': key,
                'value': this.basicProfiles[key],
                'field_type': field_type,
              });
            }
          }

          // Append password
          this.profileData.push(
            {
              'label': 'password',
              'identifier': 'password',
              'value': '',
              'field_type': 'password',
            }
          )

          for (let item of this.profileData) {
            this.editValue.push(item.value);
          }
        },
        (failure: any) => {

        }
      );
  }

  editBasic(event: any, attribute: any, index: number): any {
    this.oldValue = this.profileData[index].value;
    this.indexEdited = index;
    delete this.editValue[index];
  }

  editCancel(event: any, attribute: any, index: number): any {
    this.indexEdited = 999999;
    this.editValue[index] = this.oldValue;
    this.isSaveLoading = false;
  }

  saveBasic(event: any, attribute: any, index: number): any {
    const value = this.editValue[index];
    attribute.new_value = value;

    // Valu not provided
    if (attribute.new_value) {
      this.isSaveLoading = true;

      // We need check this value used or not (email and username)
      if (attribute.identifier === 'username' || attribute.identifier === 'email') {
        // attribute.value = value;
        this.duplicateCheck(attribute, index);
      } else {
        this.changeConfirmModal(attribute, index);
      }
    } else {
      this.presentToast('Tidak boleh kosong.')
    }
  }

  /***
   * Special access need secure code
   * This send a secure code to user
   */
  requestSecureCode(attribute: any): any {
    attribute.action = 'request_secure_code';
    attribute.method = 1; // use email

    this.personService.requestSecureCode(attribute)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
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

  passwordCheck(attribute: any, index: number): void {
    this.personService.passwordCheck({'password': attribute.new_value})
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.presentConfirmPrompt(attribute, index);
        },
        (failure: any) => {
          const error = failure.error;

          if (attribute.identifier === 'password') {
            if (error.password) {
              this.errorString = error.password.join('');
            }
          }

          this.presentToast(this.errorString);
        }
      );
  }

  changeConfirmModal(attribute: any, index: number): any {
    if (attribute.identifier === 'password') {
      this.passwordCheck(attribute, index);
    } else {
      this.presentConfirmPrompt(attribute, index);
    }
  }

  duplicateCheck(attribute: any, index: number): any {
    const value = this.editValue[index];
    attribute.new_value = value;

    this.personService.duplicateCheck(attribute)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.changeConfirmModal(attribute, index);
        },
        (failure: { error: { detail: any; }; statusText: any; }) => {
          let message = (failure.error && failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  /***
   * Let's validate security code for update
   */
  validateAction(secure_code: string, attribute: any, index: any): any {
    this.isLoading = true;
    attribute.secure_code = secure_code;
    attribute.uuid = this.personData.uuid;

    const identifier = attribute.identifier;
    const data = {
      'uuid': this.personData.uuid,
      'secure_code': secure_code,
    }

    data[identifier] = attribute.new_value;

    this.personService.postUpdateProfile(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          // Show notification...
          this.presentToast('Menyimpan berhasil.');
          this.alert.dismiss();

          // Replace username in localStorage
          if (attribute.identifier === 'username') {
            this.personData.username = attribute.new_value;
            this.personService.setLocalData('credentialsKey', this.personData);
          }

          this.editValue[index] = attribute.new_value;
          this.profileData[index].value = attribute.new_value;
          this.indexEdited = 999999;
        },
        (failure: any) => {
          const error = failure.error;

          if (identifier === 'password') {
            if (error.password) {
              this.errorString = error.password.join('');
            }
          }

          if (error.detail) {
            this.errorString = error.detail;
          }

          this.presentToast(this.errorString);
        }
      );
  }

}
