import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WagesRecordPaymentComponent } from './wages-record-payment.component';

describe('WagesRecordPaymentComponent', () => {
  let component: WagesRecordPaymentComponent;
  let fixture: ComponentFixture<WagesRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WagesRecordPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
