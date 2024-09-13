import { TestBed } from '@angular/core/testing';

import { CompanyContactsService } from './company-contacts.service';

describe('CompanyContactsService', () => {
  let service: CompanyContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
