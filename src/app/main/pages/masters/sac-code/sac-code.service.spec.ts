import { TestBed } from '@angular/core/testing';

import { SacCodeService } from './sac-code.service';

describe('SacCodeService', () => {
  let service: SacCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SacCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
