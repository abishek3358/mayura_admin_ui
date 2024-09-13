import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceViewComponent } from './employee-attendance-view.component';

describe('EmployeeAttendanceViewComponent', () => {
  let component: EmployeeAttendanceViewComponent;
  let fixture: ComponentFixture<EmployeeAttendanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
