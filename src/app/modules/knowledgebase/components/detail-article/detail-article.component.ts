import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

// Services
import { KnowledgeBaseService } from '../../services/knowledgebase.service';

@Component({
  selector: 'app-component-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss'],
})
export class DetailArticleComponent implements OnInit {

  article_uuid: string;
  isLoading: boolean = false;
  articleData: any;
  content: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    private KBService: KnowledgeBaseService,
    protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.article_uuid = this.activatedRoute.snapshot.paramMap.get('article_uuid');
    this.getArticle();
  }

  getArticle(): any {
    this.isLoading = true;
    this.KBService.getArticle(this.article_uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.articleData = response;
          this.content = this.sanitizer.bypassSecurityTrustHtml(this.articleData.description);
        },
        (failure: any) => {
          // Error
        }
      );
  }

}
