import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorBoqComponent } from './sub-contractor-boq.component';

describe('SubContractorBoqComponent', () => {
  let component: SubContractorBoqComponent;
  let fixture: ComponentFixture<SubContractorBoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubContractorBoqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
