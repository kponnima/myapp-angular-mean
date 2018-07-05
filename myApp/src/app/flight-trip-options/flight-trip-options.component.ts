import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

import { Flight } from '../_models/flight';
import { User } from '../_models/user';

import { CartService } from '../_services/cart.service';
import { UserService } from '../_services/user.service';
import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';
@Component({
  selector: 'app-flight-trip-options',
  templateUrl: './flight-trip-options.component.html',
  styleUrls: ['./flight-trip-options.component.css']
})
export class FlightTripOptionsComponent implements OnInit {
 
  origin: any;
  destination: any;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;

  isLinear = true;
  message: '';

  loggedname: any;
  _user: User[];

  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private authService: AuthService,
    private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
      this.authService.getLoggedInUsers().subscribe(_ => {
          this._user = _}
      );
      /*this.loggedInUserItems$ = this.authService.getLoggedInUsers();
      this.loggedInUserItems$.subscribe(_ => {
        this._user = _;
        this.loggedInUserItems = _;
        this.loggedname = this.loggedInUserItems["0"].username;
      });*/
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this.formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this.formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
  }

  goBack(): void {
    this.location.back();
  }

  confirmFlight(){
    this.router.navigate(['flight-trip-summary']);
  }
}
