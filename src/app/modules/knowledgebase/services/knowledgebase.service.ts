import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Component environment
import { modulenv } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {

  constructor(
    private httpClient: HttpClient) {

  }

  /***
   * Load article...
   */
  getArticles(context: any): Observable<any> {
    let fetchUrl = modulenv.articleUrl;
    let nextUrl = context.nextUrl;

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    return this.httpClient
      .get(fetchUrl)
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Get single article
   */
  getArticle(uuid: string): Observable<any> {
    return this.httpClient
      .get(modulenv.articleUrl + uuid + '/')
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
