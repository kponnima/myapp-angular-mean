import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'api/reservation';  // web api end point
  createFlightReservationUrl: string = 'api/flight-createreservation';
  getFlightReservationUrl: string = 'api/flight-reservation';
  //baseUrl: string = 'http://localhost:4200/api';

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  getReservationByPNR(pnr: String) {
    return this.http.get<Reservation>(this.getFlightReservationUrl + '/' + pnr )
    .pipe(
      delay(this.delayMs),
      catchError(this.handleError<Reservation>(`getReservation pnr=${pnr}`))
    );
  }

  createReservation(reservation: Reservation) {
    return this.http.post(this.createFlightReservationUrl, reservation)
    .pipe(delay(this.delayMs));
  }


  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
