import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';

import { Payment } from '../_models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentCardSubject: BehaviorSubject<Payment[]> = new BehaviorSubject([]);
  private paymentCard: Payment[] = [];

  constructor(private http: HttpClient) { 
    this.paymentCardSubject.subscribe(_ => this.paymentCard = _);
  }

  private baseUrl: string = 'api/paymentcard';  // web api end point

  public addCard(item: Payment) {
    this.paymentCardSubject.next([...this.paymentCard, item]);
  }

  /** POST: save the new payment details to the server */
  saveCard (items: Payment[]): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, items).pipe(
      catchError(this.handleError<Payment>('saveCard'))
    );
  }

  public getCards(): Observable<Payment[]> {
    return this.paymentCardSubject;
  }

  public getCardsCount() {
    return this.paymentCard.length;
  }

  public getTotalAmount(): Observable<number> {
    return this.paymentCardSubject.pipe(
      map((items: Payment[]) => {
        return items.reduce((prev, curr: Payment) => {
          return prev + curr.amount;
        }, 0);
      })
    );
  }

  public removeCards(item: Payment) {
    const currentItems = [...this.paymentCard];
    const itemsWithoutRemoved = currentItems.filter(_ => _.token !== item.token);
    this.paymentCardSubject.next(itemsWithoutRemoved);
  }

  public removeAllCards() {
    this.paymentCardSubject.unsubscribe;
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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