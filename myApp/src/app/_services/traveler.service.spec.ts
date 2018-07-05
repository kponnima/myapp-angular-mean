import { TestBed, inject } from '@angular/core/testing';

import { TravelerService } from './traveler.service';

describe('TravelerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TravelerService]
    });
  });

  it('should be created', inject([TravelerService], (service: TravelerService) => {
    expect(service).toBeTruthy();
  }));
});
