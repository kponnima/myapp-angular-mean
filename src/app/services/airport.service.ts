import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'api/airports';  // web api end point
  airportCreateUrl: string = 'api/airport-create';  // web api end point
  airportDetailUrl: string = 'api/airport-detail';  // web api end point
  airportEditUrl: string = 'api/airport-edit';  // web api end point
  airportDeleteUrl: string = 'api/airport';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  getAirports() {
    return this.http.get<Airport[]>(this.baseUrl)
      .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getListOfAirports() {
    return this.http.get(this.baseUrl)
      .pipe(
/*         map(res => {
          return res.json().map(item => {
            return item.airport_code
          });
        }), */
        delay(this.delayMs)
      ); // simulate latency with delay;
  }

  getAirportByCode(airport_code: String) {
    return this.http.get<Airport[]>(this.airportDetailUrl + '/' + airport_code)
      //.pipe(delay(this.delayMs));
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
