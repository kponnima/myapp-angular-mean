import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TravelerService } from './traveler.service';

describe('TravelerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TravelerService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([TravelerService], (service: TravelerService) => {
    expect(service).toBeTruthy();
  }));
});
