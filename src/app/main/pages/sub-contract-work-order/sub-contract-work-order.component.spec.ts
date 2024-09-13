import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractWorkOrderComponent } from './sub-contract-work-order.component';

describe('SubContractWorkOrderComponent', () => {
  let component: SubContractWorkOrderComponent;
  let fixture: ComponentFixture<SubContractWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractWorkOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
