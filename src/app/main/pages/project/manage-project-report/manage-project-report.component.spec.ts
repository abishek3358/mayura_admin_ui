import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectReportComponent } from './manage-project-report.component';

describe('ManageProjectReportComponent', () => {
  let component: ManageProjectReportComponent;
  let fixture: ComponentFixture<ManageProjectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProjectReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
