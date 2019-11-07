import { Component, OnInit } from '@angular/core';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  segment: string = 'option'; // Set default to option
  personData: any;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private personService: PersonService) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.segment = this.router.getCurrentNavigation().extras.state.segment;
      }
    });
  }

  ngOnInit() {
    this.personData = this.personService.getLocalToken();
  }

  segmentChanged(event: any): any {
    this.segment = event.detail.value;
  }

}
