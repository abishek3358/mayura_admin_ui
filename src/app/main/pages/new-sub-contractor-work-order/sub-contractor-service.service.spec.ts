import { TestBed } from '@angular/core/testing';

import { SubContractorServiceService } from './sub-contractor-service.service';

describe('SubContractorServiceService', () => {
  let service: SubContractorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubContractorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
