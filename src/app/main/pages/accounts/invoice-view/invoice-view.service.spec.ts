import { TestBed } from '@angular/core/testing';

import { InvoiceViewService } from './invoice-view.service';

describe('InvoiceViewService', () => {
  let service: InvoiceViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
