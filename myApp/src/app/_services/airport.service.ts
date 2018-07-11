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

  private baseUrl: string = 'api/airports';  // web api end point
  private airportCreateUrl: string = 'api/airport-create';  // web api end point
  private airportDetailUrl: string = 'api/airport-detail';  // web api end point
  private airportEditUrl: string = 'api/airport-edit';  // web api end point
  private airportDeleteUrl: string = 'api/airport';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  private delayMs = 10000;

  getAirports() {
    return this.http.get<Airport[]>(this.baseUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getAirportByCode(airport_code: String) {
    return this.http.get<Airport>(this.airportDetailUrl + '/' + airport_code)
    .pipe(delay(this.delayMs));
  }

  createAirport(airport: Airport) {
    return this.http.post(this.airportCreateUrl, airport)
    .pipe(delay(this.delayMs));
  }

  updateAirport(airport: Airport) {
    return this.http.put(this.airportEditUrl + '/' + airport.airportcode, airport)
    .pipe(delay(this.delayMs));
  }

  deleteAirport(airport_code: String) {
    return this.http.delete(this.airportDeleteUrl + '/' + airport_code)
    .pipe(delay(this.delayMs));
  }
}
