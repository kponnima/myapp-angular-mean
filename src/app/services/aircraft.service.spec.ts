import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AircraftService } from './aircraft.service';

describe('AircraftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AircraftService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([AircraftService], (service: AircraftService) => {
    expect(service).toBeTruthy();
  }));

  it('#getAircrafts should return real value', inject([AircraftService], (service: AircraftService) => {
    expect(service.getAircrafts()).toBeTruthy();
  }));
});
