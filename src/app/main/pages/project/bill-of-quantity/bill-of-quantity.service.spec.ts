import { TestBed } from '@angular/core/testing';

import { BillOfQuantityService } from './bill-of-quantity.service';

describe('BillOfQuantityService', () => {
  let service: BillOfQuantityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillOfQuantityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
