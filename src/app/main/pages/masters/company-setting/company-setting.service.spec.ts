import { TestBed } from '@angular/core/testing';

import { CompanySettingService } from './company-setting.service';

describe('CompanySettingService', () => {
  let service: CompanySettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
