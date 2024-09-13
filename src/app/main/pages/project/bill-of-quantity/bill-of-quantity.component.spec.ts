import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfQuantityComponent } from './bill-of-quantity.component';

describe('BillOfQuantityComponent', () => {
  let component: BillOfQuantityComponent;
  let fixture: ComponentFixture<BillOfQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOfQuantityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
