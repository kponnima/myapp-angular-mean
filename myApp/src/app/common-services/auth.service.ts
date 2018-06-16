import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
//import { User } from '../../../models/User';
import { User } from './user';

@Injectable()
export class AuthService {  
    // Create a stream of logged in status to communicate throughout app
    private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {
  }

  login(user: User){
    if (user.userName !== '' && user.password !== '' ) {
      this.loggedIn.next(true);
      this.router.navigate(['']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['signin']);
  }
}