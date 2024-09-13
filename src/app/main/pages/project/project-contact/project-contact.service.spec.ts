import { TestBed } from '@angular/core/testing';

import { ProjectContactService } from './project-contact.service';

describe('ProjectContactService', () => {
  let service: ProjectContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
