import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRatingPage } from './list-rating.page';

describe('ListRatingPage', () => {
  let component: ListRatingPage;
  let fixture: ComponentFixture<ListRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRatingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
