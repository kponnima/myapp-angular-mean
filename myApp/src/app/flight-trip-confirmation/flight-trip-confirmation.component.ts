import { Component, Injectable, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { Traveler } from '../_models/traveler';
import { Payment } from '../_models/payment';
import { Reservation } from '../_models/reservation';

import { TravelerService } from '../_services/traveler.service';
import { PaymentService } from '../_services/payment.service';
import { ReservationService } from '../_services/reservation.service';
import { UserService } from '../_services/user.service';
import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';

@Component({
  selector: 'app-flight-trip-confirmation',
  templateUrl: './flight-trip-confirmation.component.html',
  styleUrls: ['./flight-trip-confirmation.component.css']
})
export class FlightTripConfirmationComponent implements OnInit {
  private createloading: boolean = true;
  @Input() reservation: Reservation;
  @Input() traveler: Traveler;
  @Input() payment: Payment;
  
  @Input() segmentcountControl = new FormControl();
  @Input() originControl = new FormControl();
  @Input() destinationControl = new FormControl();
  @Input() flightnoControl = new FormControl();
  
  @Input() passengercountControl = new FormControl();
  @Input() firstnameControl = new FormControl();
  @Input() middlenameControl = new FormControl();
  @Input() lastnameControl = new FormControl();
  @Input() specialserviceControl = new FormControl();
  @Input() mealpreferenceControl = new FormControl();
  @Input() miscpreferenceControl = new FormControl();
  @Input() passportneededControl = new FormControl();
  @Input() emergencycontactfirstnameControl = new FormControl();
  @Input() emergencycontactmiddlenameControl = new FormControl();
  @Input() emergencycontactlastnameControl = new FormControl();

  @Input() totalamountControl = new FormControl();
  @Input() paymentstatusControl = new FormControl();
  @Input() cardendingControl = new FormControl();
  @Input() cardbrandControl = new FormControl();
  message = '';
  pnr: any;
  travelerID: any;
  token: any;
  
  constructor(private router: Router, private route: ActivatedRoute, private reservationService: ReservationService, private travelerService: TravelerService,
    private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.fetchreservation();
  }
  
  fetchreservation(): void {
    this.createloading = true;
    this.route.queryParams.subscribe(params => {
      this.pnr = params['pnr'];
    });
    this.reservationService.getReservationByPNR(this.pnr)
      .subscribe(pnr => {
        this.reservation = pnr,
        this.travelerID = this.reservation.traveler_id;
        this.token = this.reservation.card_token;

        this.travelerService.getTravelerById(this.travelerID)
        .subscribe(res => {
          this.traveler = res
        });

        this.paymentService.getCardByToken(this.token)
        .subscribe(resp => {
          this.payment = resp
        });

        this.segmentcountControl.setValue(this.reservation.segment_count),
        this.originControl.setValue(this.reservation.origin),
        this.destinationControl.setValue(this.reservation.destination),
        this.flightnoControl.setValue(this.reservation.flight_no),

        this.passengercountControl.setValue(this.reservation.passenger_count),
        this.firstnameControl.setValue(this.traveler.travelerfirstname),
        this.middlenameControl.setValue(this.traveler.travelermiddlename),
        this.lastnameControl.setValue(this.traveler.travelerlastname),
        this.specialserviceControl.setValue(this.traveler.travelerspecialservices),
        this.mealpreferenceControl.setValue(this.traveler.travelermealpreference),
        this.miscpreferenceControl.setValue(this.traveler.travelerseatpreference),
        this.passportneededControl.setValue(this.traveler.needpassport),
        this.emergencycontactfirstnameControl.setValue(this.traveler.emergencycontactfirstname),
        this.emergencycontactmiddlenameControl.setValue(this.traveler.emergencycontactmiddlename),
        this.emergencycontactlastnameControl.setValue(this.traveler.emergencycontactlastname),

        this.totalamountControl.setValue(this.reservation.total_amount),
        this.paymentstatusControl.setValue(this.reservation.paymentstatus),
        this.cardendingControl.setValue(this.payment.last4),
        this.cardbrandControl.setValue(this.payment.brand),
        
        this.createloading = false;
      });
  }
}