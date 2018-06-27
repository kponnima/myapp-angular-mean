import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Flight } from '../_models/flight';
@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) {
   }

  private baseUrl: string = 'api/flight';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api/';

  getFlights() {
    return this.http.get<Flight[]>(this.baseUrl);
  }

  getFlightById(flight_no: number) {
    return this.http.get<Flight>(this.baseUrl + '/' + flight_no);
  }

  createFlight(flight: Flight) {
    return this.http.post(this.baseUrl, flight);
  }

  updateFlight(flight: Flight) {
    return this.http.put(this.baseUrl + '/' + flight.flight_no, flight);
  }

  deleteFlight(flight_no: number) {
    return this.http.delete(this.baseUrl + '/' + flight_no);
  }
}
