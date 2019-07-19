import { Component, Injectable, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Moment } from 'moment';
import * as moment from 'moment';

import { User } from '../../../_models/user';
import { Traveler } from '../../../_models/traveler';
import { Payment } from '../../../_models/payment';
import { Reservation } from '../../../_models/reservation';

import { TravelerService } from '../../../_services/traveler.service';
import { PaymentService } from '../../../_services/payment.service';
import { ReservationService } from '../../../_services/reservation.service';
import { UserService } from '../../../_services/user.service';
import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';

@Component({
  selector: 'app-flight-trip-confirmation',
  templateUrl: './flight-trip-confirmation.component.html',
  styleUrls: ['./flight-trip-confirmation.component.css']
})
export class FlightTripConfirmationComponent implements OnInit {
  private loading: boolean = false;
  private createloading: boolean = true;
  private passportneeded: boolean = true;
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

  @Input() traveleraddress = new FormControl();
  @Input() travelerzipcode = new FormControl();
  @Input() traveleremail = new FormControl();
  @Input() travelerphone = new FormControl();
  
  @Input() specialserviceControl = new FormControl();
  @Input() mealpreferenceControl = new FormControl();
  @Input() miscpreferenceControl = new FormControl();
  @Input() passportneededControl = new FormControl();
  @Input() passportno = new FormControl();
  @Input() passportissuingcountry = new FormControl();
  @Input() passportissue = new FormControl();
  @Input() passportexpiry = new FormControl();
  @Input() passportcountryofcitizenship = new FormControl();
  @Input() passportcountryofresidence = new FormControl();

  @Input() emergencycontactfirstnameControl = new FormControl();
  @Input() emergencycontactmiddlenameControl = new FormControl();
  @Input() emergencycontactlastnameControl = new FormControl();

  @Input() emergencycontactaddress = new FormControl();
  @Input() emergencycontactzipcode = new FormControl();
  @Input() emergencycontactemail = new FormControl();
  @Input() emergencycontactphone = new FormControl();

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
    this.loading= true;
    this.passportneeded = false;
    this.fetchreservation();
    this.loading= false;
  }

  fetchreservation(): void {
    this.loading= true;
    this.createloading = true;
    this.route.queryParams.subscribe(params => {
      this.pnr = params['pnr'];
    });
    this.reservationService.getReservationByPNR(this.pnr)
      .subscribe(pnr => {
        this.loading= true;
        this.reservation = pnr;
        this.travelerID = this.reservation.traveler_id;
        this.token = this.reservation.card_token;

        this.segmentcountControl.setValue(this.reservation.segment_count);
        this.originControl.setValue(this.reservation.origin);
        this.destinationControl.setValue(this.reservation.destination);
        this.flightnoControl.setValue(this.reservation.flight_no);
        this.passengercountControl.setValue(this.reservation.passenger_count);
        this.totalamountControl.setValue(this.reservation.total_amount);
        this.paymentstatusControl.setValue(this.reservation.paymentstatus);

        this.travelerService.getTravelerById(this.travelerID)
          .subscribe(res => {
            this.loading= true;
            this.traveler = res;
            //console.log(res);
            this.firstnameControl.setValue(this.traveler["0"].travelerfirstname);
            this.middlenameControl.setValue(this.traveler["0"].travelermiddlename);
            this.lastnameControl.setValue(this.traveler["0"].travelerlastname);

            this.traveleraddress.setValue(this.traveler["0"].traveleraddress);
            this.travelerzipcode.setValue(this.traveler["0"].travelerzipcode);
            this.traveleremail.setValue(this.traveler["0"].traveleremail);
            this.travelerphone.setValue(this.traveler["0"].travelerphone);

            this.specialserviceControl.setValue(this.traveler["0"].travelerspecialservices);
            this.mealpreferenceControl.setValue(this.traveler["0"].travelermealpreference);
            this.miscpreferenceControl.setValue(this.traveler["0"].travelerseatpreference);
            this.passportneededControl.setValue((this.traveler["0"].needpassport) ? "Yes" : "No");
            this.traveler["0"].needpassport ? this.passportneeded = true : this.passportneeded = false;

            this.passportno.setValue(this.traveler["0"].passportno);
            this.passportissuingcountry.setValue(this.traveler["0"].passportissuingcountry);
            this.passportissue.setValue(this.traveler["0"].passportissue);
            this.passportexpiry.setValue(this.traveler["0"].passportexpiry);
            this.passportcountryofcitizenship.setValue(this.traveler["0"].passportcountryofcitizenship);
            this.passportcountryofresidence.setValue(this.traveler["0"].passportcountryofresidence);

            this.emergencycontactfirstnameControl.setValue(this.traveler["0"].emergencycontactfirstname);
            this.emergencycontactmiddlenameControl.setValue(this.traveler["0"].emergencycontactmiddlename);
            this.emergencycontactlastnameControl.setValue(this.traveler["0"].emergencycontactlastname);

            this.emergencycontactaddress.setValue(this.traveler["0"].emergencycontactaddress);
            this.emergencycontactzipcode.setValue(this.traveler["0"].emergencycontactzipcode);
            this.emergencycontactemail.setValue(this.traveler["0"].emergencycontactemail);
            this.emergencycontactphone.setValue(this.traveler["0"].emergencycontactphone);
          });

        this.paymentService.getCardByToken(this.token)
          .subscribe(resp => {
            this.loading= true;
            this.payment = resp;
            this.cardendingControl.setValue(this.payment["0"].last4);
            this.cardbrandControl.setValue(this.payment["0"].brand);
            this.loading= false;
          });

        this.createloading = false;
      });
  }
}