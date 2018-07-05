import { Component, OnInit ,OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common'

import { ObservableMedia } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';

import { MessageService } from '../_helpers/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  message: any = {};
  subscription: Subscription;
  public cols: Observable<number>;

  constructor(private messageService: MessageService, private observableMedia: ObservableMedia) {
     // subscribe to app component messages
     this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
   }
   ngOnInit() {
    const grid = new Map([
      ['xs', 1],
      ['sm', 2],
      ['md', 2],
      ['lg', 3],
      ['xl', 3]
    ]);
    let start: number;
    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });
    this.cols = this.observableMedia.asObservable()
      .pipe(
        map(change => {
        console.log(change);
        console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      }),
        startWith(start));
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
