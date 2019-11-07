import { Component } from '@angular/core';
import { Platform, MenuController, Events, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// LOCAL SERVICES
import { PersonService } from './modules/person/services/person.service';
import { NoticeService } from './modules/notice/services/notice.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isLogged: boolean = false;
  appPages: any;
  personData: any;
  notificationCount: number = 0;

  constructor(
    public menuCtrl: MenuController,
    public events: Events,
    private navCtrl: NavController,
    private platform: Platform,
    private personService: PersonService,
    private noticeService: NoticeService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isLogged = this.personService.isAuthenticated();
      this.personData = this.personService.getLocalToken();

      if (this.isLogged) this.loadNotification();

      // Capture event refresh global
      this.events.subscribe('refreshGlobalEvent', (data) => {
        if (this.isLogged) this.loadNotification();
      });

      this.events.subscribe('notificationEvent', (data) => {
        if (this.isLogged) this.loadNotification();
      });

      this.events.subscribe('loadNotificationEvent', (data) => {
        if (this.isLogged) this.loadNotification();
      });

      this.appPages = [
        {
          title: 'Beranda',
          url: '/home',
          icon: 'home',
          restrict: false
        },
        {
          title: 'Media',
          url: '/media',
          icon: 'business',
          restrict: false
        },
        {
          title: 'Sanggahan',
          url: '/protest',
          icon: 'flag',
          restrict: false
        },
        {
          title: 'Login',
          url: '/login',
          icon: 'unlock',
          restrict: this.isLogged
        },
        {
          title: 'Daftar',
          url: '/register',
          icon: 'key',
          restrict: this.isLogged
        },
        {
          title: 'Profil',
          url: '/profile',
          icon: 'contact',
          restrict: !this.isLogged
        },
        {
          title: 'Notifikasi',
          url: '/notification',
          icon: 'notifications',
          restrict: !this.isLogged
        },
        {
          title: 'Logout',
          url: '/logout',
          icon: 'log-out',
          restrict: !this.isLogged
        },
        {
          title: 'Informasi',
          url: '/information',
          icon: 'help-buoy',
          restrict: false
        }
      ];

      this.events.subscribe('loginEvent', (data) => {
        this.isLogged = true;
        this.personData = this.personService.getLocalToken();

        this.appMenuLogin();
        this.loadNotification();
      });
    });
  }

  loadNotification(): any {
    this.noticeService.getNotificationCount()
      .pipe(
        finalize(() => {
          // Pas
        })
      )
      .subscribe((response: any) => {
          this.notificationCount = response.count;
        },
        _failure => {
          // Pass
        }
      );
  }

  logout(): void {
    this.personService.postLogout()
      .pipe(
        finalize(() => {
          this.isLogged = false;
          this.menuCtrl.toggle();
          this.appMenuLogout();
          this.navCtrl.navigateRoot('/home');

          delete this.personData;
        })
      )
      .subscribe(
        _response => {
          // Pass
        },
        _failure => {
          // Pass
        }
      );
  }

  appMenuLogout(): any {
    // Logout
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/logout';
    });
    this.appPages[index].restrict = true;

    // Profile
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/profile';
    });
    this.appPages[index].restrict = true;

    // Notification
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/notification';
    });
    this.appPages[index].restrict = true;

    // Login
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/login';
    });
    this.appPages[index].restrict = false;

    // Register
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/register';
    });
    this.appPages[index].restrict = false;
  }

  appMenuLogin(): any {
    // Logout
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/logout';
    });
    this.appPages[index].restrict = false;

    // Profile
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/profile';
    });
    this.appPages[index].restrict = false;

    // Notification
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/notification';
    });
    this.appPages[index].restrict = false;

    // Login
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/login';
    });
    this.appPages[index].restrict = true;

    // Register
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/register';
    });
    this.appPages[index].restrict = true;
  }

}
