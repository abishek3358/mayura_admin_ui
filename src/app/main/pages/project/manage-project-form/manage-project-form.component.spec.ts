import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectFormComponent } from './manage-project-form.component';

describe('ManageProjectFormComponent', () => {
  let component: ManageProjectFormComponent;
  let fixture: ComponentFixture<ManageProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProjectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
