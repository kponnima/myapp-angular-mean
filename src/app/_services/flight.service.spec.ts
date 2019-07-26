import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FlightService } from './flight.service';

describe('FlightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([FlightService], (service: FlightService) => {
    expect(service).toBeTruthy();
  }));
});
