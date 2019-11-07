import { Component, OnInit, Input } from '@angular/core';
import { Events, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

// Components
import { SubmitRatingComponent } from '../submit-rating/submit-rating.component';
import { EditAttributeComponent } from '../edit-attribute/edit-attribute.component';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-detail-media',
  templateUrl: './detail-media.component.html',
  styleUrls: ['./detail-media.component.scss'],
})
export class DetailMediaComponent implements OnInit {

  @Input('mediaData') mediaData: any;
  @Input('personData') personData: any;
  @Input('attributeData') attributeData: any;

  ratingsLoop: Array<number> = [1, 2, 3, 4, 5];

  constructor(
    public modalController: ModalController,
    public router: Router,
    public events: Events,
    private escortService: EscortService) { }

  ngOnInit() {
    this.events.subscribe('refreshMediaEvent', (data) => {
      this.mediaData = data;
    });

    this.events.subscribe('editMediaEvent', (data) => {
      this.mediaData.classification = data.classification;
      this.mediaData.label = data.label;

      if (this.mediaData.attribute_values) {
        this.mediaData.attribute_values = data;
      }
    });

    this.events.subscribe('editRatingEvent', (data) => {
      this.mediaData = data;
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SubmitRatingComponent,
      componentProps: {
        'mediaData': this.mediaData
      }
    });

    return await modal.present();
  }

  async presentEditAttributeModal(data: any) {
    const modal = await this.modalController.create({
      component: EditAttributeComponent,
      componentProps: {
        'entityData': this.mediaData,
        'attributeData': data,
      }
    });

    modal.onDidDismiss().then((response: any) => {
      if (response.data.value) {
        data.value.object = response.data.value;
      }
    });

    return await modal.present();
  }

  sendRating(): any {
    if (this.personData) {
      this.presentModal();
    } else {
      this.router.navigate(['/login']);
    }
  }

  editAttribute(data: any): any {
    if (this.personData) {
      this.presentEditAttributeModal(data);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
