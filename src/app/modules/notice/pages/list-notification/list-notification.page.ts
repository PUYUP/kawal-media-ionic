import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.page.html',
  styleUrls: ['./list-notification.page.scss'],
})
export class ListNotificationPage implements OnInit {

  constructor(
    public events: Events) { }

  ngOnInit() {
  }

  refreshPage(): any {
    this.events.publish('notificationEvent', {'action': 'refresh'});
  }

  markReads(): any {
    this.events.publish('notificationEvent', {'action': 'markread'});
  }

  deleteAlls(): any {
    this.events.publish('notificationEvent', {'action': 'delete'});
  }

}
