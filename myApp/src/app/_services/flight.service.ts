import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Flight } from '../_models/flight';
@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) {
   }

  private baseUrl: string = 'api/flights';  // web api end point
  private flightCreateUrl: string = 'api/flight-create';  // web api end point
  private flightDetailUrl: string = 'api/flight-detail';  // web api end point
  private flightEditUrl: string = 'api/flight-edit';  // web api end point
  private flightDeleteUrl: string = 'api/flight';  // web api end point
    //baseUrl: string = 'http://localhost:4200/api/flights';

  private delayMs = 500;

  getFlights() {
    return this.http.get<Flight[]>(this.baseUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getFlightById(flight_no: number) {
    return this.http.get<Flight>(this.flightDetailUrl + '/' + flight_no);
  }

  createFlight(flight: Flight) {
    return this.http.post(this.flightCreateUrl, flight);
  }

  updateFlight(flight: Flight) {
    return this.http.put(this.flightEditUrl + '/' + flight.flight_no, flight);
  }

  deleteFlight(flight_no: number) {
    return this.http.delete(this.flightDeleteUrl + '/' + flight_no);
  }
}
