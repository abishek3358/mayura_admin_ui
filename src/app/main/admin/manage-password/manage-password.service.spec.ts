import { TestBed } from '@angular/core/testing';

import { ManagePasswordService } from './manage-password.service';

describe('ManagePasswordService', () => {
  let service: ManagePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
