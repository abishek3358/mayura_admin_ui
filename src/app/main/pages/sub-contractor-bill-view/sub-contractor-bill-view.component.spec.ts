import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorBillViewComponent } from './sub-contractor-bill-view.component';

describe('SubContractorBillViewComponent', () => {
  let component: SubContractorBillViewComponent;
  let fixture: ComponentFixture<SubContractorBillViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractorBillViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorBillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
