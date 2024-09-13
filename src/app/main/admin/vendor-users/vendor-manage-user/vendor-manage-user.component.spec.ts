import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManageUserComponent } from './vendor-manage-user.component';

describe('VendorManageUserComponent', () => {
  let component: VendorManageUserComponent;
  let fixture: ComponentFixture<VendorManageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManageUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
