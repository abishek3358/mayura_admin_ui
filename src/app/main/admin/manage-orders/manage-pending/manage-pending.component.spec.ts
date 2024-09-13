import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePendingComponent } from './manage-pending.component';

describe('ManagePendingComponent', () => {
  let component: ManagePendingComponent;
  let fixture: ComponentFixture<ManagePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
