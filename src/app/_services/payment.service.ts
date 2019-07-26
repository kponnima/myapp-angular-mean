import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Payment } from '../_models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paymentCardSubject: BehaviorSubject<Payment[]> = new BehaviorSubject([]);
  paymentCard: Payment[] = [];

  constructor(private http: HttpClient) { 
    this.paymentCardSubject.subscribe(_ => this.paymentCard = _);
  }

  baseUrl: string = 'api/paymentcard';  // web api end point
  //private getCardByTokenUrl: string = 'api/flight-traveler';  // web api end point

  //private delayMs = 10000;
  delayMs = environment.delayMs;

  addCard(item: Payment) {
    this.paymentCardSubject.next([...this.paymentCard, item]);
  }

  /** POST: save the new payment details to the server */
  saveCard (items: Payment[]): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, items)
    .pipe(
      delay(this.delayMs),
      catchError(this.handleError<Payment>('saveCard'))
    );
  }

  getCards(): Observable<Payment[]> {
    return this.paymentCardSubject;
  }

  getCardByToken(token: String) {
    return this.http.get<Payment>(this.baseUrl + '/' + token)
    .pipe(delay(this.delayMs));
  }

  getCardsCount() {
    return this.paymentCard.length;
  }

  getTotalAmount(): Observable<number> {
    return this.paymentCardSubject.pipe(
      map((items: Payment[]) => {
        return items.reduce((prev, curr: Payment) => {
          return prev + curr.amount;
        }, 0);
      })
    );
  }

  removeCards(item: Payment) {
    const currentItems = [...this.paymentCard];
    const itemsWithoutRemoved = currentItems.filter(_ => _.token !== item.token);
    this.paymentCardSubject.next(itemsWithoutRemoved);
  }

  removeAllCards() {
    this.paymentCardSubject.unsubscribe;
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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