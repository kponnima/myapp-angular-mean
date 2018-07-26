import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';

import { AuthService } from '../../../_helpers/auth.service';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  title = 'MYAPP';
  username:string = '';
  @ViewChild('sidenav') sidenav: MatSidenav;

  isLoggedIn$: Observable<boolean>;
  loading: boolean = true;
  loggedin: boolean = false; //delete once the observable is fixed for refresh issue

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private userService: UserService, private titleService: Title) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.loggedin = localStorage.getItem('jwtToken') ? !null : null; //delete once the observable is fixed for refresh issue and update html with *ngIf="isLoggedIn$ | async"
    this.username = localStorage.getItem('username');

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).pipe(
      map(() => this.activatedRoute)
    ).pipe(
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })).pipe(
        filter((route) => route.outlet === 'primary')
      ).pipe(
        mergeMap((route) => route.data)
      ).subscribe((event) => this.titleService.setTitle(event['title']));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.loggedin = localStorage.getItem('jwtToken') ? !null : null; 
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.loggedin = localStorage.getItem('jwtToken') ? !null : null; 
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => { this.loading = false; }, 1000)
      // this.loading = false;
      this.loggedin = localStorage.getItem('jwtToken') ? !null : null; 
    }
    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.loggedin = localStorage.getItem('jwtToken') ? !null : null; 
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.loggedin = localStorage.getItem('jwtToken') ? !null : null; 
    }
  }

  close() {
    //console.log('I am invoked');
    this.sidenav.toggle();
  }

  viewUserProfile() {
    this.router.navigate(['user/'+ this.username]);
  }

  logout() {
    this.authService.logout();
  }
}
