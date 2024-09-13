import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractWorkOrderFormComponent } from './sub-contract-work-order-form.component';

describe('SubContractWorkOrderFormComponent', () => {
  let component: SubContractWorkOrderFormComponent;
  let fixture: ComponentFixture<SubContractWorkOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractWorkOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractWorkOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
