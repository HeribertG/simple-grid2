import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyGridComponent } from './body-grid.component';

describe('BodyGridComponent', () => {
  let component: BodyGridComponent;
  let fixture: ComponentFixture<BodyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
