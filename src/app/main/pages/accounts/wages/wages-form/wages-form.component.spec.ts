import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagesFormComponent } from './wages-form.component';

describe('WagesFormComponent', () => {
  let component: WagesFormComponent;
  let fixture: ComponentFixture<WagesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WagesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
