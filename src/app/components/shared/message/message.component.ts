import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common'

import { Observable, Subscription } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';

import { MessageService } from '../../../helpers/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  message: any = {};
  subscription: Subscription;

  constructor(private messageService: MessageService) {
    // subscribe to app component messages
    this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
  }
  ngOnInit() { }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
