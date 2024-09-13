import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubContractorWorkOrderComponent } from './new-sub-contractor-work-order.component';

describe('NewSubContractorWorkOrderComponent', () => {
  let component: NewSubContractorWorkOrderComponent;
  let fixture: ComponentFixture<NewSubContractorWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubContractorWorkOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubContractorWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
