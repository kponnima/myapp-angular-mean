import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Aircraft } from '../models/aircraft';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'api/aircrafts';  // web api end point
  airportCreateUrl: string = 'api/aircraft-create';  // web api end point
  airportDetailUrl: string = 'api/aircraft-detail';  // web api end point
  airportEditUrl: string = 'api/aircraft-edit';  // web api end point
  airportDeleteUrl: string = 'api/aircraft';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  getAircrafts() {
    return this.http.get<Aircraft[]>(this.baseUrl)
      .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getListOfAircrafts() {
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

  getAircraftByNo(airport_no: Number) {
    return this.http.get<Aircraft[]>(this.airportDetailUrl + '/' + airport_no)
    //.pipe(delay(this.delayMs));
  }

  createAircraft(aircraft: Aircraft) {
    return this.http.post(this.airportCreateUrl, aircraft)
      .pipe(delay(this.delayMs));
  }

  updateAircraft(aircraft: Aircraft) {
    return this.http.put(this.airportEditUrl + '/' + aircraft.aircraft_no, aircraft)
      .pipe(delay(this.delayMs));
  }

  deleteAircraft(aircraft_no: Number) {
    return this.http.delete(this.airportDeleteUrl + '/' + aircraft_no)
      .pipe(delay(this.delayMs));
  }
}
