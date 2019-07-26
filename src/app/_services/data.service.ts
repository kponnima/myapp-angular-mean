import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  pnrSource = new BehaviorSubject('');
  currentPNR = this.pnrSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changePNR(pnr: string) {
    this.pnrSource.next(pnr);
  }
}
