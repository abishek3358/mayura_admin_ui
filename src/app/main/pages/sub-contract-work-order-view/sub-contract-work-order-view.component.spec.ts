import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractWorkOrderViewComponent } from './sub-contract-work-order-view.component';

describe('SubContractWorkOrderViewComponent', () => {
  let component: SubContractWorkOrderViewComponent;
  let fixture: ComponentFixture<SubContractWorkOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractWorkOrderViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractWorkOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
