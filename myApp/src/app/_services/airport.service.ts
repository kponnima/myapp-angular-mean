import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Airport } from '../_models/airport';
@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = 'api/user';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  private delayMs = 500;

  getAirports() {
    return this.http.get<Airport[]>(this.baseUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getAirportByCode(airport_code: String) {
    return this.http.get<Airport>(this.baseUrl + '/' + airport_code);
  }

  createAirport(airport: Airport) {
    return this.http.post(this.baseUrl, airport);
  }

  updateAirport(airport: Airport) {
    return this.http.put(this.baseUrl + '/' + airport.airportcode, airport);
  }

  deleteAirport(airport_code: String) {
    return this.http.delete(this.baseUrl + '/' + airport_code);
  }
}
