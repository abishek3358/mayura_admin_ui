import { TestBed } from '@angular/core/testing';

import { PlantMachineryFormService } from './plant-machinery-form.service';

describe('PlantMachineryFormService', () => {
  let service: PlantMachineryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantMachineryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
