import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticlePage } from './detail-article.page';

describe('DetailArticlePage', () => {
  let component: DetailArticlePage;
  let fixture: ComponentFixture<DetailArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailArticlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
