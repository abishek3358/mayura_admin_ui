import { TestBed } from '@angular/core/testing';

import { ProfitAndLossService } from './profit-and-loss.service';

describe('ProfitAndLossService', () => {
  let service: ProfitAndLossService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitAndLossService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
