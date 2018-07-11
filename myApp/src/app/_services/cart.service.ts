import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';

import { Flight } from '../_models/flight';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsInCartSubject: BehaviorSubject<Flight[]> = new BehaviorSubject([]);
  private itemsInCart: Flight[] = [];

  constructor() { 
    this.itemsInCartSubject.subscribe(_ => this.itemsInCart = _);
  }

  private baseUrl: string = 'api/flight';  // web api end point

  public addToCart(item: Flight) {
    this.itemsInCartSubject.next([...this.itemsInCart, item]);
  }

  public getItems(): Observable<Flight[]> {
    return this.itemsInCartSubject;
  }

  public getItemsCount() {
    return this.itemsInCart.length;
  }

  public getTotalAmount(): Observable<number> {
    return this.itemsInCartSubject.pipe(
      map((items: Flight[]) => {
        return items.reduce((prev, curr: Flight) => {
          return prev + curr.price;
        }, 0);
      })
    );
  }

  public removeFromCart(item: Flight) {
    const currentItems = [...this.itemsInCart];
    const itemsWithoutRemoved = currentItems.filter(_ => _.flight_no !== item.flight_no);
    this.itemsInCartSubject.next(itemsWithoutRemoved);
  }

  public removeAllFromCart() {
    this.itemsInCartSubject.unsubscribe;
  }
}