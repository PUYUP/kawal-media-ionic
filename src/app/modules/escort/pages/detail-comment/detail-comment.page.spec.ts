import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCommentPage } from './detail-comment.page';

describe('DetailCommentPage', () => {
  let component: DetailCommentPage;
  let fixture: ComponentFixture<DetailCommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
