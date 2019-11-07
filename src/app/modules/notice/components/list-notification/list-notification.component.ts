import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Events } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// Services
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-component-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss'],
})
export class ListNotificationComponent implements OnInit {

  isLoadingInit: boolean = false;
  notifications: any;
  listNotifications: any;
  nextUrl: string;
  notificationParams = {
    'nextUrl': '',
  };

  constructor(
    public router: Router,
    public events: Events,
    public alertController: AlertController,
    private noticeService: NoticeService) { }

  ngOnInit() {
    this.getNotifications({});

    this.events.subscribe('notificationEvent', (data) => {
      if (data.action === 'refresh') {
        this.getNotifications({});
      }

      if (data.action === 'markread') {
        this.markReads();
      }

      if (data.action === 'delete') {
        this.deleteAlls();
      }
    });
  }

  async presentAlertConfirm(data: any) {
    const alert = await this.alertController.create({
      header: 'Apakah Yakin?',
      message: 'Tindakan tidak bisa dikembalikan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            // Pass
          }
        }, {
          text: 'Hapus',
          handler: () => {
            this.performDelete(data);
          }
        }
      ]
    });

    await alert.present();
  }

  getNotifications(context: any): any {
    if (!context.isLoadNext) this.isLoadingInit = true;

    const nextUrl = context.nextUrl;
    const event = context.event;

    let params = {
      'nextUrl': nextUrl
    }

    this.noticeService.getNotifications(params)
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;

          if (event) {
            event.target.complete();
          }
        })
      )
      .subscribe(
        (response: any) => {
          this.notifications = response;
          this.nextUrl = this.notifications.navigate.next;

          const results = this.notifications.results;

          if (event) {
            this.listNotifications.push(...results);
          } else {
            this.listNotifications = results;
            this.events.publish('loadNotificationEvent', {});
          }

          // Done! No more page
          if (!this.nextUrl && event) {
            event.target.disabled = true;
          }
        },
        (failure: any) => {
          // Error
        }
      );
  }

  loadNextData(event: any): any {
    if (this.nextUrl) {
      this.notificationParams['nextUrl'] = this.nextUrl;
      this.notificationParams['event'] = event;
      this.notificationParams['isLoadNext'] = true;

      this.getNotifications(this.notificationParams);
    } else {
      event.target.disabled = true;
    }
  }

  toDetail(data: any): void {
    // Media source as notification
    if (data.content_source_type === 'media' && data.content_source_uuid) {
      if (data.verb === 'C') {
        this.router.navigate(['/media', data.content_source_uuid, 'protest', data.content_notified_uuid, 'comment', 'notified', data.content_uuid]);
      }

      if (data.verb === 'R') {
        this.router.navigate(['/media', data.content_source_uuid, 'protest', data.content_parent_uuid, 'comment', data.content_notified_uuid, 'notified', data.content_uuid]);
      }

      // Mark read
      if (data.unread) {
        this.markRead(data);
      }
    }
  }

  markRead(data: any): any {
    this.noticeService.markNotificationRead(data)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          let index = this.listNotifications.findIndex((x: { uuid: string; }) => x.uuid === data.uuid);
          if (this.listNotifications[index]) {
            this.listNotifications[index].unread = false;
          }
        },
        (failure: any) => {
          // Error
        }
      );
  }

  markReads(): void {
    this.noticeService.markNotificationReads()
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          this.getNotifications({});
        },
        (failure: any) => {
          // Error
        }
      );
  }

  deleteAlls(): void {
    this.noticeService.deleteNotifications()
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          this.getNotifications({});
        },
        (failure: any) => {
          // Error
        }
      );
  }

  deleteItem(data: any): any {
    setTimeout(() => {
      this.presentAlertConfirm(data);
    }, 50);
  }

  performDelete(data: any): any {
    this.noticeService.deleteNotification(data)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        (response: any) => {
          this.listNotifications = this.listNotifications.filter(function( obj: any ) {
            return obj.uuid !== data.uuid;
          });
        },
        (failure: any) => {
          // Error
        }
      );
  }

}
