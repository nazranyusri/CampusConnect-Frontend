import { TestBed } from '@angular/core/testing';

import { ClubadminGuardService } from './clubadmin-guard.service';

describe('ClubadminGuardService', () => {
  let service: ClubadminGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubadminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
