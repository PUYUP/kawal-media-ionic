import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMediaPage } from './pages/list-media/list-media.page';
import { SubmitMediaPage } from './pages/submit-media/submit-media.page';
import { ListProtestPage } from './pages/list-protest/list-protest.page';
import { DetailMediaPage } from './pages/detail-media/detail-media.page';
import { ListRatingPage } from './pages/list-rating/list-rating.page';
import { SubmitProtestPage } from './pages/submit-protest/submit-protest.page';
import { DetailProtestPage } from './pages/detail-protest/detail-protest.page';
import { ListCommentPage } from './pages/list-comment/list-comment.page';
import { DetailCommentPage } from './pages/detail-comment/detail-comment.page';

// Guards
import { AuthGuard } from '../person/guards/auth.guard';

const routes: Routes = [
  {
    path: 'media',
    children: [
      {
        path: '',
        component: ListMediaPage
      },
      {
        path: ':uuid',
        children: [
          {
            path: '',
            component: DetailMediaPage
          },
          {
            path: 'edit',
            component: SubmitMediaPage,
            canActivate: [AuthGuard]
          },
          {
            path: 'rating',
            component: ListRatingPage
          },
          {
            path: 'protest',
            children: [
              {
                path: '',
                component: ListProtestPage
              },
              {
                path: 'submit',
                component: SubmitProtestPage,
                canActivate: [AuthGuard]
              },
              {
                path: ':protest_uuid',
                children: [
                  {
                    path: '',
                    component: DetailProtestPage
                  },
                  {
                    path: 'edit',
                    component: SubmitProtestPage,
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'comment',
                    children: [
                      {
                        path: '',
                        component: ListCommentPage
                      },
                      {
                        path: 'notified',
                        children: [
                          {
                            path: '',
                            component: ListCommentPage
                          },
                          {
                            path: ':notified_uuid',
                            component: ListCommentPage
                          }
                        ]
                      },
                      {
                        path: ':comment_uuid',
                        children: [
                          {
                            path: '',
                            component: DetailCommentPage
                          },
                          {
                            path: 'notified',
                            children: [
                              {
                                path: '',
                                component: DetailCommentPage
                              },
                              {
                                path: ':notified_uuid',
                                component: DetailCommentPage
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      }
    ]
  },
  {
    path: 'submit-media',
    component: SubmitMediaPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'protest',
    component: ListProtestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscortRoutingModule { }
