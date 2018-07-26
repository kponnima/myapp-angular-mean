import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../_helpers/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //mybool: boolean;
  title = 'MYAPP';
  isLoggedIn$: Observable<boolean>;

  constructor( private router: Router, private authService: AuthService ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    /*this.router.events.forEach((event: NavigationEvent) => {
      // After Navigation
      if (event instanceof NavigationEnd) {
        switch (event.url) {
        case '/':
        {
          this.mybool = true;
          break;
        }
        case '/login':
        {
          this.mybool = true;
          break;
        }
        case '/signup':
        {
          this.mybool = true;
          break;
        }
        case '/signin':
        {
          this.mybool = true;
          break;
        }
        default:
          this.mybool = false;
        }
      }
    });*/
  }

  logout() {
    this.authService.logout();
  }

}
