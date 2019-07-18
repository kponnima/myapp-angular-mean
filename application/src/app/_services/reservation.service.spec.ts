import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservationService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([ReservationService], (service: ReservationService) => {
    expect(service).toBeTruthy();
  }));
});
