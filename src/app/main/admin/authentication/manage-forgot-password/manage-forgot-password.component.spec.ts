import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageForgotPasswordComponent } from './manage-forgot-password.component';

describe('ManageForgotPasswordComponent', () => {
  let component: ManageForgotPasswordComponent;
  let fixture: ComponentFixture<ManageForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
