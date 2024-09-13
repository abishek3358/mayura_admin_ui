import { TestBed } from '@angular/core/testing';

import { WagesService } from './wages.service';

describe('WagesService', () => {
  let service: WagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
