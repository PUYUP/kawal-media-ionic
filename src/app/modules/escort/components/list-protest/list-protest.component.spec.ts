import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProtestComponent } from './list-protest.component';

describe('ListProtestComponent', () => {
  let component: ListProtestComponent;
  let fixture: ComponentFixture<ListProtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProtestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
