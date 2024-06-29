import { TestBed } from '@angular/core/testing';

import { PersakaService } from './persaka.service';

describe('PersakaService', () => {
  let service: PersakaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersakaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
