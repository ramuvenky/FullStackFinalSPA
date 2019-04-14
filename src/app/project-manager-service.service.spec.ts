import { TestBed } from '@angular/core/testing';

import { ProjectManagerServiceService } from './project-manager-service.service';

describe('ProjectManagerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectManagerServiceService = TestBed.get(ProjectManagerServiceService);
    expect(service).toBeTruthy();
  });
});
