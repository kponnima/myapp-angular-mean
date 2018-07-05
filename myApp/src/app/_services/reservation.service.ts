import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Reservation } from '../_models/reservation';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  
  private baseUrl: string = 'api/reservation';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  getReservation(pnr: number): Observable<Reservation>{

    return this.http.get<Reservation>(this.baseUrl + '/' + pnr ).pipe(
      catchError(this.handleError<Reservation>('getReservation pnr=${pnr}'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
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
