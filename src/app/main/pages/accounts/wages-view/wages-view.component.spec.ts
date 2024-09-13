import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagesViewComponent } from './wages-view.component';

describe('WagesViewComponent', () => {
  let component: WagesViewComponent;
  let fixture: ComponentFixture<WagesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WagesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
