import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VScrollbarComponent } from './v-scrollbar.component';

describe('VScrollbarComponent', () => {
  let component: VScrollbarComponent;
  let fixture: ComponentFixture<VScrollbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VScrollbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
