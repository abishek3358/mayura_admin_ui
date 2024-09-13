import { TestBed } from '@angular/core/testing';

import { ManageRewardService } from './manage-reward.service';

describe('ManageRewardService', () => {
  let service: ManageRewardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRewardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
