import { TestBed } from '@angular/core/testing';

import { SubContractorBoqService } from './sub-contractor-boq.service';

describe('SubContractorBoqService', () => {
  let service: SubContractorBoqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubContractorBoqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
