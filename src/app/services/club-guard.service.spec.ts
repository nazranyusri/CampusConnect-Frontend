import { TestBed } from '@angular/core/testing';

import { ClubGuardService } from './club-guard.service';

describe('ClubGuardService', () => {
  let service: ClubGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
