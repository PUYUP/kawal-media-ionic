import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommentPage } from './list-comment.page';

describe('ListCommentPage', () => {
  let component: ListCommentPage;
  let fixture: ComponentFixture<ListCommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
