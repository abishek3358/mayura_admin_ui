import { TestBed } from '@angular/core/testing';

import { SubContractorBillService } from './sub-contractor-bill.service';

describe('SubContractorBillService', () => {
  let service: SubContractorBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubContractorBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
