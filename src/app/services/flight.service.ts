import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Flight } from '../models/flight';
@Injectable({
  providedIn: 'root'
})
export class FlightService {

  selectedFlightSubject: BehaviorSubject<Flight[]> = new BehaviorSubject([]);
  selectedFlight: Flight[] = [];

  constructor(private http: HttpClient) {
    this.selectedFlightSubject.subscribe(_ => this.selectedFlight = _);
   }

  baseUrl: string = 'api/flights';  // web api end point
  flightCreateUrl: string = 'api/flight-create';  // web api end point
  flightDetailUrl: string = 'api/flight-detail';  // web api end point
  flightEditUrl: string = 'api/flight-edit';  // web api end point
  flightDeleteUrl: string = 'api/flight';  // web api end point
  flightSearchResultsUrl: string = 'api/flight-search-results';  // web api end point
    //baseUrl: string = 'http://localhost:4200/api/flights';

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  getFlights() {
    return this.http.get<Flight[]>(this.baseUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;
  }

  getFlightById(flight_no: number) {
    return this.http.get<Flight>(this.flightDetailUrl + '/' + flight_no)
    .pipe(delay(this.delayMs));
  }

  getFlightsBySearchParams(Params: HttpParams) {
    return this.http.get<Flight[]>(this.flightSearchResultsUrl , { params: Params })
    .pipe(delay(this.delayMs));
  }

  createFlight(flight: Flight) {
    return this.http.post(this.flightCreateUrl, flight)
    .pipe(delay(this.delayMs));
  }

  updateFlight(flight: Flight) {
    return this.http.put(this.flightEditUrl + '/' + flight.flight_no, flight)
    .pipe(delay(this.delayMs));
  }

  deleteFlight(flight_no: number) {
    return this.http.delete(this.flightDeleteUrl + '/' + flight_no)
    .pipe(delay(this.delayMs));
  }

  addSelectedFlight(flight: Flight) {
    this.selectedFlightSubject.next([...this.selectedFlight, flight]);
  }

  getSelectedFlights(): Observable<Flight[]> {
    return this.selectedFlightSubject;
  }

  removeSelectedFlight(flight: Flight) {
    const currentItems = [...this.selectedFlight];
    const itemsWithoutRemoved = currentItems.filter(_ => _.flight_no !== flight.flight_no);
    this.selectedFlightSubject.next(itemsWithoutRemoved);
  }
}
