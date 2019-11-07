import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// Services
import { KnowledgeBaseService } from '../../services/knowledgebase.service';

@Component({
  selector: 'app-component-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss'],
})
export class ListArticleComponent implements OnInit {

  isLoadingInit: boolean = false;
  articles: any;
  listArticles: any;
  nextUrl: string;
  articleParams: any;

  constructor(
    public router: Router,
    private KBService: KnowledgeBaseService) { }

  ngOnInit() {
    this.getArticles({});
  }

  getArticles(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;

    let params = {
      'nextUrl': nextUrl
    }

    this.KBService.getArticles(params)
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
          this.articles = response;
          this.nextUrl = this.articles.navigate.next;

          const results = this.articles.results;

          if (event) {
            this.listArticles.push(...results);
          } else {
            this.listArticles = results;
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
      this.articleParams['nextUrl'] = this.nextUrl;
      this.articleParams['event'] = event;

      this.getArticles(this.articleParams);
    } else {
      event.target.disabled = true;
    }
  }

  toDetail(uuid: string): any {
    this.router.navigate(['/information', uuid]);
  }

}
