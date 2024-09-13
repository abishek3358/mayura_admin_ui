import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRecordPaymentComponent } from './purchase-record-payment.component';

describe('PurchaseRecordPaymentComponent', () => {
  let component: PurchaseRecordPaymentComponent;
  let fixture: ComponentFixture<PurchaseRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseRecordPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
