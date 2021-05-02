import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HScrollbarComponent } from './h-scrollbar.component';

describe('HScrollbarComponent', () => {
  let component: HScrollbarComponent;
  let fixture: ComponentFixture<HScrollbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HScrollbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
