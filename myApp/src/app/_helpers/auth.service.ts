import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import { User } from '../_models/user';

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