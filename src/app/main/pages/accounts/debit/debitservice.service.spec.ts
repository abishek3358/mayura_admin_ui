import { TestBed } from '@angular/core/testing';

import { DebitserviceService } from './debitservice.service';

describe('DebitserviceService', () => {
  let service: DebitserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebitserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
