import { Component, Injectable, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reservation } from '../_models/reservation';
import { User } from '../_models/user';

import { ReservationService } from '../_services/reservation.service';
import { UserService } from '../_services/user.service';
import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';@Component({
  selector: 'app-flight-trip-confirmation',
  templateUrl: './flight-trip-confirmation.component.html',
  styleUrls: ['./flight-trip-confirmation.component.css']
})
export class FlightTripConfirmationComponent implements OnInit {
  @Input() reservation: Reservation;
  message = '';
  pnr: any;
  
  constructor(private router: Router, private route: ActivatedRoute, private reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.fetchreservation();
  }
  
  fetchreservation(): void {
    this.route.queryParams.subscribe(params => {
      this.pnr = params['pnr'];
    });
    this.reservationService.getReservation(this.pnr)
      .subscribe(pnr => this.reservation = pnr);
  }

}