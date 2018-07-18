import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable, BehaviorSubject, Subscription, of, Subject } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { MatTable, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';

import { Flight } from '../_models/flight';
import { User } from '../_models/user';
import { Payment } from '../_models/payment';

import { CartService } from '../_services/cart.service';
import { UserService } from '../_services/user.service';
import { PaymentService } from '../_services/payment.service';
import { ReservationService } from '../_services/reservation.service';

import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';
import { AlertDialogComponent } from '../_shared/alert-dialog/alert-dialog.component';
@Component({
  selector: 'app-flight-trip-summary',
  templateUrl: './flight-trip-summary.component.html',
  styleUrls: ['./flight-trip-summary.component.css']
})
export class FlightTripSummaryComponent implements OnInit {
  editableTravelers:Boolean = false;

  payment: Payment[];
  //@Input() payments: Payment;
  flights: any;
  travelers: any;
  origin: any;
  destination: any;
  token: string = '';
  brand: any;
  last4: any;
  message = '';

  tripsummaryFlightsFormGroup: FormGroup;
  tripsummaryTravelersFormGroup: FormGroup;
  tripsummaryPaymentsFormGroup: FormGroup;

  expiryMonthPattern = "^((0[1-9])|(1[0-2]))$";
  expiryYearPattern = "^(\\d{4})$";
  cvcPattern = "^(\\d{4})$";

  emailAddress = 'kushalappapp@gmail.com';
  paymentSuccessBoolean:Boolean = false;
  successmessage: string;

  public cols: Observable<number>;

  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];
  dataSource = this.shoppingCartItems$;

  booking_data = {
    username: 'kponnima86',
    pnrno: 'ABCDEF',
    total_amount: 1200,
    card_token: this.token,
    paymentstatus: 'PAID',
    segment_count: 1,
    segment_id: 'ABCDEF.1.1',
    flight_no: 1,
    origin: 'PHX',
    destination: 'DFW',
    departuredatetime: new Date(),
    arrivaldatetime: new Date(),
    price: 1200,
    cabintype: 'BUSINESS',
    seatno: '1B',
    passenger_count: 1, 
    traveler_id: 'ABCDEF.1.1',
    travelerfirstname: 'kushalappa',
    travelermiddlename: '',
    travelerlastname: 'ponnimada poonacha',
    traveleraddress: '10117 W ANGELS LN, PEORIA, AZ',
    travelerzipcode: '85383',
    traveleremail: 'kushalappapp@gmail.com',
    travelerphone: 6233633064,
    travelerseatpreference: 'window',
    travelerspecialservices: '',
    travelermealpreference: 'veg',
    needpassport: false,
    passportno: '',
    passportexpiry: '', 
    passportissuingcountry: 'India',
    passportcountryofcitizenship: 'India',
    passportcountryofresidence: '',
    emergencycontactfirstname: 'Pooja Ponnamma',
    emergencycontactmiddlename: '',
    emergencycontactlastname: 'Shivachalianda vijayakumar',
    emergencycontactaddress: '10117 W ANGELS LN, PEORIA, AZ',
    emergencycontactzipcode: '85383',
    emergencycontactemail: 'pooja.ponnamma@gmail.com',
    emergencycontactphone: 4807294315
  }

  loggedname: any;

  //pnr = Math.random().toString(36).substr(2, 5);
  pnr = 'ABCDEF';

  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];


  constructor(private formBuilder: FormBuilder, private observableMedia: ObservableMedia, private http: HttpClient, private _zone: NgZone,
    private dialog: MatDialog, private overlay: Overlay, private location: Location, private cartService: CartService, private paymentService: PaymentService,
    private reservationService: ReservationService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {

      this.shoppingCartItems$ = this.cartService.getItems();
      this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _); 

      this.loggedInUserItems$ = this.authService.getLoggedInUsers();
      this.loggedInUserItems$.subscribe(_ => {
        this.loggedInUserItems = _;
        this.loggedname = this.loggedInUserItems["0"].username;
      });
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    console.log(this.pnr);

    this.flights = JSON.parse(localStorage.getItem('flights'));
    this.travelers = JSON.parse(localStorage.getItem('travelers'));
    //var arrayLength = JSON.parse(localStorage.getItem('flights')).length;

    this.editableTravelers = false;

    this.tripsummaryFlightsFormGroup = this.formBuilder.group({
      'segmentcountControl': [1, Validators.required],
      'originControl': [this.flights.origin, Validators.required],
      'destinationControl': [this.flights.destination, Validators.required],
      'flightnoControl': [this.flights.flight_no, Validators.required],
      'carrierControl': [this.flights.carrier, Validators.required],
      'departtimeControl': [this.flights.departuredatetime, Validators.required],
      'returntimeControl': [this.flights.arrivaldatetime, Validators.required],
      'flightdurationControl': [this.flights.duration, Validators.required],
      'flightpriceControl': [this.flights.price, Validators.required]
    });
    this.tripsummaryTravelersFormGroup = this.formBuilder.group({
      'passengercountControl': [1, Validators.required],
      'firstnameControl': [this.travelers.formArray["0"].firstnameCtrl, Validators.required],
      'middlenameControl': [this.travelers.formArray["0"].middlenameCtrl, Validators.required],
      'lastnameControl': [this.travelers.formArray["0"].lastnameCtrl, Validators.required],
      'addressControl': [this.travelers.formArray["1"].addressControl, Validators.required],
      'zipcodeControl': [this.travelers.formArray["1"].zipcodeControl, Validators.required],
      'emailControl': [this.travelers.formArray["1"].emailControl, Validators.required],
      'phoneControl': [this.travelers.formArray["1"].phoneControl, Validators.required],
      'specialserviceControl': [this.travelers.formArray["2"].specialserviceControl, Validators.required],
      'seatpreferenceControl': [this.travelers.formArray["2"].seatpreferenceControl, Validators.required],
      'mealpreferenceControl': [this.travelers.formArray["2"].mealpreferenceControl, Validators.required],
      'passportneededControl': [this.travelers.formArray["3"].passportneededControl, Validators.required],
      'passportnoControl': [this.travelers.formArray["3"].passportnoControl, Validators.required],
      'passportissuecountryControl': [this.travelers.formArray["3"].passportissuecountryControl, Validators.required],
      'passportissuedateControl': [this.travelers.formArray["3"].passportissuedateControl, Validators.required],
      'passportexpirydateControl': [this.travelers.formArray["3"].passportexpirydateControl, Validators.required],
      'passportcountryofcitizenshipControl': [this.travelers.formArray["3"].passportcountryofcitizenshipControl, Validators.required],
      'passportcountryofresidenceControl': [this.travelers.formArray["3"].passportcountryofresidenceControl, Validators.required],
      'emergencycontactfirstnameControl': [this.travelers.formArray["3"].emergencycontactfirstnameControl, Validators.required],
      'emergencycontactmiddlenameControl': [this.travelers.formArray["3"].emergencycontactmiddlenameControl, Validators.required],
      'emergencycontactlastnameControl': [this.travelers.formArray["3"].emergencycontactlastnameControl, Validators.required],
      'emergencycontactaddressControl': [this.travelers.formArray["3"].emergencycontactaddressControl, Validators.required],
      'emergencycontactzipcodeControl': [this.travelers.formArray["3"].emergencycontactzipcodeControl, Validators.required],
      'emergencycontactemailControl': [this.travelers.formArray["3"].emergencycontactemailControl, Validators.required],
      'emergencycontactphoneControl': [this.travelers.formArray["3"].emergencycontactphoneControl, Validators.required],
    });
    this.tripsummaryPaymentsFormGroup = this.formBuilder.group({
      'number': [null, Validators.compose( [ Validators.minLength(10), Validators.maxLength(16), Validators.required ] )],
      'exp_month': [null, Validators.compose( [ Validators.pattern(this.expiryMonthPattern), Validators.required ] )],
      'exp_year': [null, Validators.compose( [ Validators.pattern(this.expiryYearPattern), Validators.required ] )],
      'cvc': [null, Validators.compose( [ Validators.minLength(3), Validators.maxLength(4), Validators.required ] )],
    });

    this.tripsummaryFlightsFormGroup.disable();
    this.tripsummaryTravelersFormGroup.disable();
  }

  goBack(): void {
    this.location.back();
  }

  editTravelers() {
    this.editableTravelers = true;
    this.tripsummaryTravelersFormGroup.enable();
  }

  editedTravelers() {
    this.editableTravelers = false;
    this.tripsummaryTravelersFormGroup.disable();
  }

  savePayment(form: NgForm) {
    this.message = 'Processing...';
    (<any>window).Stripe.card.createToken(form
      ,{
        email: this.emailAddress
      },
      (status: number, response: any) => {
      this._zone.run(() => {
        if (status === 200) {
          this.token = response.id;
          let cardtoken = response.card.id;
          this.brand = response.card.brand;
          this.last4 = response.card.last4;
          
          //console.log(response.card);
          this.message = 'Success!';
          const httpOptions = {
            headers: new HttpHeaders({
              'email': this.emailAddress,
              'token': this.token,
              'amount': '100',
              'orderid': this.pnr
            })
          };
          this.http.post<Payment[]>('/api/charge', {}, httpOptions)
            .subscribe(res => {
              //console.log(res);
              this.payment = res;
              this.saveCard(res);
              /*this.http.post('/api/paymentcard', res)
              .subscribe(resp => {
                //console.log(resp);
              });*/

            });
        } else {
          this.message = response.error.message;
        }
      });
    });
  }

  saveCard(items: Payment[]): void {
    this.paymentService.saveCard(items)
      .subscribe(resp => {
        //console.log(resp);
        //this.successmessage = 'Payment successful !';
        this.successmessage = 'Payment successful ! -- ' + this.brand + ' ending - ' + this.last4;
        this.paymentSuccessBoolean = true;
      })
  }
  
  cancelBooking(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    //dialogConfig.height = '90%';
    //dialogConfig.width = '90%';
    dialogConfig.data = {target: 'home'};

    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('User closed the dialog');
    });
    //this.router.navigate(['home']);
  }

  confirmBooking(){
    //this.reservationService.createReservation(this.booking_data)
    this.http.post('/api/flight-createreservation', this.booking_data)
    .subscribe(resp => {
      //console.log(resp);
      this.router.navigate(['flight-trip-confirmation'], { queryParams: { pnr: this.pnr } });
    }, err => {
      this.message = err.error.msg;
    });
  }

}
