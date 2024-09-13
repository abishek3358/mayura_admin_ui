import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScBillRecordPaymentComponent } from './sc-bill-record-payment.component';

describe('ScBillRecordPaymentComponent', () => {
  let component: ScBillRecordPaymentComponent;
  let fixture: ComponentFixture<ScBillRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScBillRecordPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScBillRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
