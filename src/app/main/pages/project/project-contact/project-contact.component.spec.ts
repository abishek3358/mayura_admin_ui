import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContactComponent } from './project-contact.component';

describe('ProjectContactComponent', () => {
  let component: ProjectContactComponent;
  let fixture: ComponentFixture<ProjectContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
