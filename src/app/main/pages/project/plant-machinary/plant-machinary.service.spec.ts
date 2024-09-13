import { TestBed } from '@angular/core/testing';

import { PlantMachinaryService } from './plant-machinary.service';

describe('PlantMachinaryService', () => {
  let service: PlantMachinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantMachinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
