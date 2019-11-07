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
export class EscortService {

  constructor(
    private httpClient: HttpClient,
    private personService: PersonService) {

  }

  /***
   * Fetch constants
   */
  getConstants(context: any): Observable<any> {
    return this.httpClient
      .get(modulenv.constantUrl, {params: context})
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Submit media
   */
  postSubmitMedia(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.mediaUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update media
   */
  patchUpdateMedia(context: any, uuid: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.mediaUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update attributes
   */
  postUpdateAttribute(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .put(modulenv.attributeUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  postPartialUpdateAttribute(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .patch(modulenv.attributeUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete attributes
   */
  deleteAttribute(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .delete(modulenv.attributeUrl + uuid + '/', { params: context, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get all attributes based on person roles
   */
  getAttributes(context: any): Observable<any> {
    const url = (context.identifiers ? modulenv.attributeUrl + '?identifiers=' + context.identifiers : modulenv.attributeUrl);
    const entity_index = context.entity_index;
    const entity_uuid = context.entity_uuid;

    let params = {
      'entity_uuid': entity_uuid,
      'entity_index': entity_index
    };

    return this.httpClient
      .get(url, { params: params })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Load next media
   */
  getMedias(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    let fetchUrl = modulenv.mediaUrl;
    let nextUrl = context.nextUrl;
    let term = context.term;
    let match = context.match;
    let status = context.status;
    let limit = context.limit;

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    let params = {}
    if (term) params['term'] = term;
    if (match) params['match'] = match;
    if (status) params['status'] = status;
    if (limit) params['limit'] = limit;

    return this.httpClient
      .get(fetchUrl, { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Get single media
   */
  getMedia(uuid: string): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const params = {}

    return this.httpClient
      .get(modulenv.mediaUrl + uuid + '/', { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Submit rating
   */
  postSubmitRating(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .post(modulenv.ratingUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update Rating
   */
  patchUpdateRating(context: any, uuid: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.ratingUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Load ratings...
   */
  getRatings(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    let fetchUrl = modulenv.ratingUrl;
    let nextUrl = context.nextUrl;
    let media_uuid = context.media_uuid;
    let params = {}

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    // Set media_uuid on first page only
    // On next page has ready in url
    if (!nextUrl) params['media_uuid'] = media_uuid;

    return this.httpClient
      .get(fetchUrl, { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Load protests...
   */
  getProtests(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    let fetchUrl = modulenv.protestUrl;
    let nextUrl = context.nextUrl;
    let media_uuid = context.media_uuid;
    let status = context.status;
    let limit = context.limit;

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    let params = {}
    if (media_uuid) params['media_uuid'] = media_uuid;
    if (status) params['status'] = status;
    if (limit) params['limit'] = limit;

    return this.httpClient
      .get(fetchUrl, { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Submit protest
   */
  postProtest(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.protestUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update protest
   */
  updateProtest(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.protestUrl + context.uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get single protest
   */
  getProtest(uuid: string): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const params = {}

    return this.httpClient
      .get(modulenv.protestUrl + uuid + '/', { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Delete protest
   */
  deleteProtest(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .delete(modulenv.protestUrl + context.uuid + '/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Attachment upload
   */
  postAttachment(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.attachmentUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Add thumbs
   */
  postThumb(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.thumbUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Update thumbs
   */
  updateThumb(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.thumbUrl + context.thumbed_uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get comments...
   */
  getComments(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    let fetchUrl = modulenv.commentUrl;
    let nextUrl = context.nextUrl;
    let protest_uuid = context.protest_uuid;
    let parent_uuid = context.parent_uuid;
    let notified_uuid = context.notified_uuid;
    let params = {}

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) fetchUrl = nextUrl;

    // Set protest_uuid on first page only
    // On next page has ready in url
    if (!nextUrl) params['protest_uuid'] = protest_uuid;

    // Get comment reply
    if (parent_uuid) params['parent_uuid'] = parent_uuid;

    // Get comment with notified
    if (notified_uuid) params['notified_uuid'] = notified_uuid;

    return this.httpClient
      .get(fetchUrl, { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Submit comment
   */
  postComment(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.commentUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update comment
   */
  updateComment(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.commentUrl + context.comment_uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete comment
   */
  deleteComment(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .delete(modulenv.commentUrl + context.uuid + '/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get single comment
   */
  getComment(uuid: string): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const params = {}

    return this.httpClient
      .get(modulenv.commentUrl + uuid + '/', { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
