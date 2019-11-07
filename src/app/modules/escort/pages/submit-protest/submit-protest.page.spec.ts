import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitProtestPage } from './submit-protest.page';

describe('SubmitProtestPage', () => {
  let component: SubmitProtestPage;
  let fixture: ComponentFixture<SubmitProtestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitProtestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitProtestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
