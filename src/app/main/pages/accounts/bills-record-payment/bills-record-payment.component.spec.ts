import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsRecordPaymentComponent } from './bills-record-payment.component';

describe('BillsRecordPaymentComponent', () => {
  let component: BillsRecordPaymentComponent;
  let fixture: ComponentFixture<BillsRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillsRecordPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
