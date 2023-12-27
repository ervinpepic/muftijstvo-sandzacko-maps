import { TestBed } from '@angular/core/testing';

import { MarkerFilterService } from './marker-filter.service';

describe('MarkerFilterService', () => {
  let service: MarkerFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
