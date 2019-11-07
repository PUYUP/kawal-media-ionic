import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Services
import { PersonService } from '../../person/services/person.service';

// Component environment
import { modulenv } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(
    private httpClient: HttpClient,
    private personService: PersonService) {

  }

  /***
   * Load items...
   */
  getNotifications(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    let fetchUrl = modulenv.notificationUrl;
    let nextUrl = context.nextUrl;

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    return this.httpClient
      .get(fetchUrl, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Load items...
   */
  getNotificationCount(): Observable<any> {
    const headers = this.personService.initAuthHeaders();
  
    return this.httpClient
      .get(modulenv.notificationUrl + 'get-count/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Mark read
   */
  markNotificationRead(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.notificationUrl + context.uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Mark reads
   */
  markNotificationReads(): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.notificationUrl + 'mark-reads/', {}, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete alls
   */
  deleteNotifications(): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .delete(modulenv.notificationUrl + 'delete-all/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete notification
   */
  deleteNotification(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .delete(modulenv.notificationUrl + context.uuid + '/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

}
