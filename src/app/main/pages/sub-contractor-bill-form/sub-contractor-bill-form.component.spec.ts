import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorBillFormComponent } from './sub-contractor-bill-form.component';

describe('SubContractorBillFormComponent', () => {
  let component: SubContractorBillFormComponent;
  let fixture: ComponentFixture<SubContractorBillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractorBillFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorBillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
