import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AirportService } from './airport.service';

describe('AirportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirportService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([AirportService], (service: AirportService) => {
    expect(service).toBeTruthy();
  }));

  it('#getAirports should return real value', inject([AirportService], (service: AirportService) => {
    expect(service.getAirports()).toBeTruthy();
  }));
});
