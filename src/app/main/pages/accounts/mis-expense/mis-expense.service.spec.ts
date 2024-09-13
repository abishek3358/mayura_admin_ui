import { TestBed } from '@angular/core/testing';

import { MisExpenseService } from './mis-expense.service';

describe('MisExpenseService', () => {
  let service: MisExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
