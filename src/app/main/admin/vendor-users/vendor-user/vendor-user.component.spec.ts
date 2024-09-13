import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorUserComponent } from './vendor-user.component';

describe('VendorUserComponent', () => {
  let component: VendorUserComponent;
  let fixture: ComponentFixture<VendorUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
