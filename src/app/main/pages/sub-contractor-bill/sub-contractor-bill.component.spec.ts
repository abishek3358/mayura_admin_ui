import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorBillComponent } from './sub-contractor-bill.component';

describe('SubContractorBillComponent', () => {
  let component: SubContractorBillComponent;
  let fixture: ComponentFixture<SubContractorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractorBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
