import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';

import { Flight } from '../_models/flight';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  itemsInCartSubject: BehaviorSubject<Flight[]> = new BehaviorSubject([]);
  itemsInCart: Flight[] = [];

  constructor() { 
    this.itemsInCartSubject.subscribe(_ => this.itemsInCart = _);
  }

  baseUrl: string = 'api/flight';  // web api end point

  addToCart(item: Flight) {
    this.itemsInCartSubject.next([...this.itemsInCart, item]);
  }

  getItems(): Observable<Flight[]> {
    return this.itemsInCartSubject;
  }

  getItemsCount() {
    return this.itemsInCart.length;
  }

  getTotalAmount(): Observable<number> {
    return this.itemsInCartSubject.pipe(
      map((items: Flight[]) => {
        return items.reduce((prev, curr: Flight) => {
          return prev + curr.price;
        }, 0);
      })
    );
  }

  removeFromCart(item: Flight) {
    const currentItems = [...this.itemsInCart];
    const itemsWithoutRemoved = currentItems.filter(_ => _.flight_no !== item.flight_no);
    this.itemsInCartSubject.next(itemsWithoutRemoved);
  }

  removeAllFromCart() {
    this.itemsInCartSubject.unsubscribe;
  }
}
