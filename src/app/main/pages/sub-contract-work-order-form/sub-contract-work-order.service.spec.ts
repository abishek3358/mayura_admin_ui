import { TestBed } from '@angular/core/testing';

import { SubContractWorkOrderService } from './sub-contract-work-order.service';

describe('SubContractWorkOrderService', () => {
  let service: SubContractWorkOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubContractWorkOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
