import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProtestPage } from './detail-protest.page';

describe('DetailProtestPage', () => {
  let component: DetailProtestPage;
  let fixture: ComponentFixture<DetailProtestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProtestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProtestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
