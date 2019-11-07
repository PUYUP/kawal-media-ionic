import { Component, OnInit } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

// LOCAL ENV.
import { environment } from '../../environments/environment';

// PERSON SERVICES
import { PersonService } from '../modules/person/services/person.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  appName: string;
  personData: any;

  constructor(
    public router: Router,
    public alertController: AlertController,
    public events: Events,
    private personService: PersonService) { }

  ngOnInit() {
    this.appName = environment.appName;
    this.personData = this.personService.getLocalToken();
  }

  refreshPGlobal(): void {
    this.events.publish('refreshGlobalEvent', {});
  }

}
