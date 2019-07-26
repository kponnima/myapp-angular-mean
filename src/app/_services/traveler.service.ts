import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Traveler } from '../_models/traveler';
@Injectable({
  providedIn: 'root'
})
export class TravelerService {

  travelerSubject: BehaviorSubject<Traveler[]> = new BehaviorSubject([]);
  traveler: Traveler[] = [];

  constructor(private http: HttpClient) {
    this.travelerSubject.subscribe(_ => this.traveler = _);
  }

  baseUrl: string = 'api/traveler';  // web api end point
  getTravelerByIDUrl: string = 'api/flight-traveler';  // web api end point
  updateTravelerByIDUrl: string = 'api/flight-traveler';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  addTraveler(item: Traveler) {
    this.travelerSubject.next([...this.traveler, item]);
  }

  /** POST: save travelers in the server */
  saveTravelers(items: Traveler[]): Observable<Traveler> {
    return this.http.post<Traveler>(this.baseUrl, items).pipe(
      catchError(this.handleError<Traveler>('saveTravelers'))
    );
  }

  getTravelers(): Observable<Traveler[]> {
    return this.travelerSubject;
  }

  getTravelerById(traveler_id: String) {
    return this.http.get<Traveler>(this.getTravelerByIDUrl + '/' + traveler_id)
      .pipe(delay(this.delayMs));
  }

  getTravelersCount() {
    return this.traveler.length;
  }

  removeTraveler(item: Traveler) {
    const currentItems = [...this.traveler];
    const itemsWithoutRemoved = currentItems.filter(_ => _.traveler_id !== item.traveler_id);
    this.travelerSubject.next(itemsWithoutRemoved);
  }

  removeAllTravelers() {
    this.travelerSubject.unsubscribe;
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  handleError<T>(operation = 'operation', result?: T) {
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
