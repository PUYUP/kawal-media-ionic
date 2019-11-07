import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListProtestPage } from './list-protest.page';

describe('ListProtestPage', () => {
  let component: ListProtestPage;
  let fixture: ComponentFixture<ListProtestPage>;
  let listProtestPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProtestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProtestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 10 elements', () => {
    listProtestPage = fixture.nativeElement;
    const items = listProtestPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });

});
