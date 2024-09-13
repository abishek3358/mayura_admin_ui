import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfQuantityTableComponent } from './bill-of-quantity-table.component';

describe('BillOfQuantityTableComponent', () => {
  let component: BillOfQuantityTableComponent;
  let fixture: ComponentFixture<BillOfQuantityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOfQuantityTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfQuantityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
