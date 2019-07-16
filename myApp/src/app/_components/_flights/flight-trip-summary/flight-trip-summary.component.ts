import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, of, Subject } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import { Moment } from 'moment';
import * as moment from 'moment';

import { environment } from '../../../../environments/environment';

import { Flight } from '../../../_models/flight';
import { User } from '../../../_models/user';
import { Payment } from '../../../_models/payment';

import { CartService } from '../../../_services/cart.service';
import { UserService } from '../../../_services/user.service';
import { PaymentService } from '../../../_services/payment.service';
import { ReservationService } from '../../../_services/reservation.service';

import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';
import { AlertDialogComponent } from '../../_shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-flight-trip-summary',
  templateUrl: './flight-trip-summary.component.html',
  styleUrls: ['./flight-trip-summary.component.scss']
})
export class FlightTripSummaryComponent implements OnInit {
  private loading: boolean = false;
  private paymentloading: boolean = false;
  private paymentfailed: boolean = false;
  private createpnrloading: boolean = false;
  private createpnrfailed: boolean = false;
  DATE_DATA_FORMAT = 'lll';
  phonePattern = "^(\\d{10})$";
  minDate = new Date();
  maxDate = new Date();
  reservationAmount = '';
  editableTravelers: Boolean = false;

  payment: Payment[];
  //@Input() payments: Payment;
  flights: any;
  travelers: any;
  //Parameters to store the route params : origin , destination on init
  origin: any;
  destination: any;
  //Parameters for tripsummaryFlightsFormGroup
  pnr: any;
  segment_id: any;
  cabintype: any;
  seatno: any;
  paymentstatus: any;
  traveler_id: any;
  //Parameters for tripsummaryTravelersFormGroup
  username: any;
  //Parameters required to save payment token
  token: string = '';
  brand: any;
  last4: any;

  loggedname: any;
  message = '';
  bookingerrormessage = '';

  tripsummaryFlightsFormGroup: FormGroup;
  tripsummaryTravelersFormGroup: FormGroup;
  tripsummaryPaymentsFormGroup: FormGroup;
  reservationFormGroup: FormGroup;

  expiryMonthPattern = "^((0[1-9])|(1[0-2]))$";
  expiryYearPattern = "^(\\d{4})$";
  cvcPattern = "^(\\d{4})$";

  emailAddress = 'kushalappapp@gmail.com'; //Admin/Customer email ID for Stripe payment storage
  paymentSuccessBoolean: Boolean = false;
  successmessage: string;

  countrylist: string[] = environment.COUNTRY_LIST;
  issuecountryfilteredOptions: Observable<string[]>;
  citizenshipcountryfilteredOptions: Observable<string[]>;
  residencecountryfilteredOptions: Observable<string[]>;

  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];
  dataSource = this.shoppingCartItems$;

  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private _zone: NgZone,
    private dialog: MatDialog, private overlay: Overlay, private location: Location, private cartService: CartService, private paymentService: PaymentService,
    private reservationService: ReservationService, private authService: AuthService, private router: Router, private route: ActivatedRoute,
    private service: MessageService, private snackBar: MatSnackBar) {

    this.shoppingCartItems$ = this.cartService.getItems();
    this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);

    this.loggedInUserItems$ = this.authService.getLoggedInUsers();
    this.loggedInUserItems$.subscribe(_ => {
      this.loggedInUserItems = _;
      this.loggedname = this.loggedInUserItems["0"].username;
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.paymentfailed = false;
    this.createpnrloading = false;
    this.createpnrfailed = false;
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    //this.pnr = Math.random().toString(36).substr(2, 5);
    //this.pnr = this.randomString(6);
    this.pnr = this.generatePNR();
    console.log(this.pnr);
    this.segment_id = this.pnr + '.1.1';
    //this.cabintype = 'BUSINESS';
    //this.seatno = this.randomSeatString(1);
    this.seatno = this.generateSeatNo();
    console.log(this.seatno);
    this.paymentstatus = 'PAID';
    this.traveler_id = this.pnr + '.1.1';

    this.username = localStorage.getItem('username');
    this.flights = JSON.parse(localStorage.getItem('flights'));
    this.travelers = JSON.parse(localStorage.getItem('travelers'));
    //var arrayLength = JSON.parse(localStorage.getItem('flights')).length;

    this.editableTravelers = false;

    this.tripsummaryFlightsFormGroup = this.formBuilder.group({
      'pnrno': [this.pnr, Validators.nullValidator],
      'total_amount': [Number(this.flights.price), Validators.nullValidator],
      'card_token': [this.token, Validators.nullValidator],
      'paymentstatus': [this.paymentstatus, Validators.nullValidator],
      'segment_count': [1, Validators.required],
      'segment_id': [this.segment_id, Validators.nullValidator],
      'flight_no': [this.flights.flight_no, Validators.required],
      'origin': [this.flights.origin, Validators.required],
      'destination': [this.flights.destination, Validators.required],
      'departuredatetime': [this.flights.departuredatetime, Validators.required],
      'arrivaldatetime': [this.flights.arrivaldatetime, Validators.required],
      'price': [Number(this.flights.price), Validators.required],
      'cabintype': [this.flights.cabintype, Validators.required],
      'flight_duration': [this.flights.duration, Validators.required],
      'seatno': [this.seatno, Validators.nullValidator]
    });
    this.tripsummaryTravelersFormGroup = this.formBuilder.group({
      'username': [this.username, Validators.nullValidator],
      'passenger_count': [1, Validators.required],
      'traveler_id': [this.traveler_id, Validators.nullValidator],
      'travelerfirstname': [this.travelers.formArray["0"].firstnameCtrl, Validators.required],
      'travelermiddlename': [this.travelers.formArray["0"].middlenameCtrl, Validators.nullValidator],
      'travelerlastname': [this.travelers.formArray["0"].lastnameCtrl, Validators.required],
      'traveleraddress': [this.travelers.formArray["1"].addressControl, Validators.required],
      'travelerzipcode': [this.travelers.formArray["1"].zipcodeControl, Validators.compose([Validators.minLength(5), Validators.required])],
      'traveleremail': [this.travelers.formArray["1"].emailControl, Validators.compose([Validators.email, Validators.required])],
      'travelerphone': [Number(this.travelers.formArray["1"].phoneControl), Validators.compose([Validators.pattern(this.phonePattern), Validators.required])],
      'travelerspecialservices': [this.travelers.formArray["2"].specialserviceControl, Validators.required],
      'travelerseatpreference': [this.travelers.formArray["2"].seatpreferenceControl, Validators.required],
      'travelermealpreference': [this.travelers.formArray["2"].mealpreferenceControl, Validators.required],
      'needpassport': [this.travelers.formArray["3"].passportneededControl, Validators.required],
      'passportno': [this.travelers.formArray["3"].passportnoControl, Validators.required],
      'passportissuingcountry': [this.travelers.formArray["3"].passportissuecountryControl, Validators.required],
      'passportissue': [this.travelers.formArray["3"].passportissuedateControl, Validators.required],
      'passportexpiry': [this.travelers.formArray["3"].passportexpirydateControl, Validators.required],
      'passportcountryofcitizenship': [this.travelers.formArray["3"].passportcountryofcitizenshipControl, Validators.required],
      'passportcountryofresidence': [this.travelers.formArray["3"].passportcountryofresidenceControl, Validators.required],
      'emergencycontactfirstname': [this.travelers.formArray["3"].emergencycontactfirstnameControl, Validators.required],
      'emergencycontactmiddlename': [this.travelers.formArray["3"].emergencycontactmiddlenameControl, Validators.nullValidator],
      'emergencycontactlastname': [this.travelers.formArray["3"].emergencycontactlastnameControl, Validators.required],
      'emergencycontactaddress': [this.travelers.formArray["3"].emergencycontactaddressControl, Validators.required],
      'emergencycontactzipcode': [Number(this.travelers.formArray["3"].emergencycontactzipcodeControl), Validators.compose([Validators.minLength(5), Validators.required])],
      'emergencycontactemail': [this.travelers.formArray["3"].emergencycontactemailControl, Validators.compose([Validators.email, Validators.required])],
      'emergencycontactphone': [Number(this.travelers.formArray["3"].emergencycontactphoneControl), Validators.compose([Validators.pattern(this.phonePattern), Validators.nullValidator])],
    });
    this.tripsummaryPaymentsFormGroup = this.formBuilder.group({
      'number': [null, Validators.compose([Validators.minLength(10), Validators.maxLength(16), Validators.required])],
      'exp_month': [null, Validators.compose([Validators.pattern(this.expiryMonthPattern), Validators.required])],
      'exp_year': [null, Validators.compose([Validators.pattern(this.expiryYearPattern), Validators.required])],
      'cvc': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(4), Validators.required])],
    });
    
    this.reservationAmount = this.flights.price;

    this.tripsummaryFlightsFormGroup.disable();
    this.tripsummaryTravelersFormGroup.disable();

    this.onChanges();

    this.issuecountryfilteredOptions = this.tripsummaryTravelersFormGroup.get('passportcountryofcitizenship').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.citizenshipcountryfilteredOptions = this.tripsummaryTravelersFormGroup.get('passportcountryofcitizenship').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.residencecountryfilteredOptions = this.tripsummaryTravelersFormGroup.get('passportcountryofresidence').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.loading = false;
  }

  /*   ngAfterViewInit() {
      this.onChanges();
    } */

  goBack(): void {
    this.location.back();
  }

  editTravelers() {
    this.editableTravelers = true;
    this.tripsummaryTravelersFormGroup.enable();
    this.tripsummaryTravelersFormGroup.get('passenger_count').disable();
    this.tripsummaryPaymentsFormGroup.disable();
  }

  editedTravelers() {
    this.editableTravelers = false;
    this.tripsummaryTravelersFormGroup.disable();
    this.tripsummaryPaymentsFormGroup.enable();
  }

  onChanges() {
    this.tripsummaryTravelersFormGroup.get('needpassport').valueChanges
      .subscribe(selectedOption => {
        if (selectedOption === 'false') {
          this.tripsummaryTravelersFormGroup.get('passportno').reset();
          this.tripsummaryTravelersFormGroup.get('passportno').disable();
          this.tripsummaryTravelersFormGroup.get('passportissue').reset();
          this.tripsummaryTravelersFormGroup.get('passportissue').disable();
          this.tripsummaryTravelersFormGroup.get('passportexpiry').reset();
          this.tripsummaryTravelersFormGroup.get('passportexpiry').disable();
          this.tripsummaryTravelersFormGroup.get('passportissuingcountry').reset();
          this.tripsummaryTravelersFormGroup.get('passportissuingcountry').disable();
          this.tripsummaryTravelersFormGroup.get('passportcountryofcitizenship').reset();
          this.tripsummaryTravelersFormGroup.get('passportcountryofcitizenship').disable();
          this.tripsummaryTravelersFormGroup.get('passportcountryofresidence').reset();
          this.tripsummaryTravelersFormGroup.get('passportcountryofresidence').disable();
        }
        else {
          this.tripsummaryTravelersFormGroup.get('passportno').enable();
          this.tripsummaryTravelersFormGroup.get('passportissue').enable();
          this.tripsummaryTravelersFormGroup.get('passportexpiry').enable();
          this.tripsummaryTravelersFormGroup.get('passportissuingcountry').enable();
          this.tripsummaryTravelersFormGroup.get('passportcountryofcitizenship').enable();
          this.tripsummaryTravelersFormGroup.get('passportcountryofresidence').enable();
        }
      });
  }

  generatePNR() {
    var tempPNR = localStorage.getItem('pnr');
    var newPNR = (tempPNR !== null) ? tempPNR : this.randomString(6)
    if (tempPNR === null) {
      localStorage.setItem('pnr', newPNR);
    }
    return newPNR;
  }

  generateSeatNo() {
    var tempSeatNo = localStorage.getItem('seatno');
    var newSeatNo = (tempSeatNo !== null) ? tempSeatNo : this.randomSeatString(1)
    if (tempSeatNo === null) {
      localStorage.setItem('seatno', newSeatNo);
    }
    return newSeatNo;
  }

  savePayment(form: NgForm) {
    this.paymentloading = true;
    this.paymentfailed = false;
    this.message = 'Processing payment...';
    (<any>window).Stripe.card.createToken(form
      , {
        email: this.emailAddress
      },
      (status: number, response: any) => {
        this._zone.run(() => {
          this.paymentloading = true;
          if (status === 200) {
            this.token = response.id;
            //let cardtoken = response.card.id;
            this.tripsummaryFlightsFormGroup.get('card_token').setValue(this.token);
            this.brand = response.card.brand;
            this.last4 = response.card.last4;
            //console.log(response.card);
            this.message = 'Card authorized successfully ! Please wait till the payment is processed';
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
                this.paymentloading = true;
                this.payment = res;
                this.saveCard(res);
                /*this.http.post('/api/paymentcard', res)
                .subscribe(resp => {
                  //console.log(resp);
                });*/
              }, err => {
                console.log(err);
                this.paymentloading = false;
                this.sendMessage(err.error.error);
                this.message = err.error.error;
                this.successmessage = err.error.error;
                this.paymentfailed = true;
              });
          } else {
            this.paymentloading = false;
            this.message = response.error.message;
            this.paymentfailed = true;
          }
        });
      });
    this.paymentloading = false;
    this.paymentfailed = false;
  }

  saveCard(items: Payment[]): void {
    this.paymentfailed = false;
    this.paymentloading = true;
    this.paymentService.saveCard(items)
      .subscribe(resp => {
        this.paymentloading = true;
        //console.log(resp);
        //this.successmessage = 'Payment successful !';
        this.successmessage = 'Payment successful ! -- ' + (this.brand).toUpperCase() + ' ending - ' + this.last4;
        this.paymentSuccessBoolean = true;
        this.paymentloading = false;
      }, err => {
        console.log(err);
        this.paymentloading = false;
        this.sendMessage(err.error.msg);
        this.message = err.error.msg;
        this.successmessage = err.error.msg;
        this.paymentfailed = true;
      });
  }

  cancelBooking() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    //dialogConfig.height = '90%';
    //dialogConfig.width = '90%';
    dialogConfig.data = { target: 'home' };

    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('User closed the dialog');
    });
    //this.router.navigate(['home']);
  }

  confirmBooking() {
    this.createpnrloading = true;
    this.loading = false;
    this.paymentloading = false;
    this.paymentfailed = true;
    this.createpnrfailed = false;
/*     this.tripsummaryTravelersFormGroup.get('needpassport').value === "true" ? this.tripsummaryTravelersFormGroup.get('needpassport').setValue(true) :
    this.tripsummaryTravelersFormGroup.get('needpassport').setValue(false); */
    this.reservationFormGroup = this.formBuilder.group({
      createpnr: this.formBuilder.array([
        this.tripsummaryFlightsFormGroup.value,
        this.tripsummaryTravelersFormGroup.value
      ])
    });
    //console.log(this.reservationFormGroup.value);
    this.reservationService.createReservation(this.reservationFormGroup.value)
      //this.http.post('/api/flight-createreservation', this.booking_data)
      .subscribe(resp => {
        //console.log(resp);
        this.loading = false;
        this.createpnrfailed = false;
        this.createpnrloading = false;
        this.router.navigate(['flight-trip-confirmation'], { queryParams: { pnr: this.pnr } });
      }, err => {
        this.createpnrloading = false;
        this.loading = false;
        this.createpnrfailed = true;
        this.bookingerrormessage = 'Create reservation failed ! Please try again.';
        this.sendMessage(err.error.msg);
      });
  }

  randomString(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  randomSeatString(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    var numresult = Math.floor(Math.random() * 10);

    return numresult + result;
  }

  sendMessage(message): void {
    // send message to subscribers via observable subject
    //this.service.sendMessage(message);
    this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
  }

  clearMessage(): void {
    this.service.clearMessage();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countrylist.filter(option => option.toLowerCase().includes(filterValue));
  }

/*   private _formatDate(value: string): string {
    let formatted_date = moment(value)
      .format(this.DATE_DATA_FORMAT);
    return formatted_date;
  } */
}
