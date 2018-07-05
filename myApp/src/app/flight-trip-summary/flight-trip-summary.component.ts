import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable, BehaviorSubject, Subscription, of, Subject } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
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
import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';
import { AlertDialogComponent } from '../_shared/alert-dialog/alert-dialog.component';
@Component({
  selector: 'app-flight-trip-summary',
  templateUrl: './flight-trip-summary.component.html',
  styleUrls: ['./flight-trip-summary.component.css']
})
export class FlightTripSummaryComponent implements OnInit {
  payment: Payment[];
  //@Input() payments: Payment;
  @Input() flight: Flight;
  origin: any;
  destination: any;
  message = '';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

  expiryMonthPattern = "^((0[1-9])|(1[0-2]))$";
  expiryYearPattern = "^(\d{4})$";
  cvcPattern = "^(\d{4})$";

  emailAddress = 'kushalappapp@gmail.com';
  paymentSuccessBoolean:Boolean = false;
  successmessage: string;

  public cols: Observable<number>;

  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];
  dataSource = this.shoppingCartItems$;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id' , 'price'];

  booking_data = {
    username: 'kponnima86',
    pnrno: 'ABCDEF',
    total_amount: 1200,
    card_token: 'tok_1CiYjYLC08GUIxrFD2X3mG2H',
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
    private authService: AuthService, private router: Router, private route: ActivatedRoute) {

      this.shoppingCartItems$ = this.cartService.getItems();
      this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _); 

      this.loggedInUserItems$ = this.authService.getLoggedInUsers();
      this.loggedInUserItems$.subscribe(_ => {
        this.loggedInUserItems = _;
        this.loggedname = this.loggedInUserItems["0"].username;
      });
    }

  ngOnInit(): void {
    console.log(this.pnr);

    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    const grid = new Map([
      ['xs', 1],
      ['sm', 2],
      ['md', 2],
      ['lg', 3],
      ['xl', 3]
    ]);
    let start: number;
    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });
    this.cols = this.observableMedia.asObservable()
      .pipe(
        map(change => {
        //console.log(change);
        //console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      }),
        startWith(start));

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this.formBuilder.group({
      number : [null, Validators.compose( [ Validators.minLength(10), Validators.required ] )],
      exp_month : [null, Validators.compose( [ Validators.pattern(this.expiryMonthPattern), Validators.required ] )],
      exp_year  : [null, Validators.compose( [ Validators.minLength(4), Validators.required ] )],
      cvc : [null, Validators.compose( [ Validators.minLength(3), Validators.required ] )],
    });
  }

  goBack(): void {
    this.location.back();
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
          let token = response.id;
          let cardtoken = response.card.id;
          let brand = response.card.brand;
          let last4 = response.card.last4;
          
          //console.log(response.card);
          this.message = 'Success!';
          const httpOptions = {
            headers: new HttpHeaders({
              'email': this.emailAddress,
              'token': token,
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
        console.log(resp);
        this.successmessage = 'Payment successful !';
        //this.successmessage = 'Payment successful ! -- ' + brand + ' ending - ' + last4;
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
    this.http.post('/api/flight-createreservation', this.booking_data).subscribe(resp => {
      //console.log(resp);
      this.router.navigate(['flight-trip-confirmation'], { queryParams: { pnr: this.pnr } });
    }, err => {
      this.message = err.error.msg;
    });
  }

}
