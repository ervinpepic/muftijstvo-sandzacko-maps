import { TestBed } from '@angular/core/testing';

import { GenerateSuggestionsService } from './generate-suggestions.service';

describe('GenerateSuggestionsService', () => {
  let service: GenerateSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateSuggestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
