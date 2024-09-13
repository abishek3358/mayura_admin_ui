import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfQuantityViewComponent } from './bill-of-quantity-view.component';

describe('BillOfQuantityViewComponent', () => {
  let component: BillOfQuantityViewComponent;
  let fixture: ComponentFixture<BillOfQuantityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOfQuantityViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfQuantityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
