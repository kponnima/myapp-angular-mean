import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter, map, mergeMap, takeWhile, shareReplay, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';

import { Flight } from '../../../_models/flight';
import { User } from '../../../_models/user';

import { CartService } from '../../../_services/cart.service';
import { UserService } from '../../../_services/user.service';
import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';
@Component({
  selector: 'app-flight-trip-options',
  templateUrl: './flight-trip-options.component.html',
  styleUrls: ['./flight-trip-options.component.scss']
})
export class FlightTripOptionsComponent implements OnInit {
  private loading: boolean = false;
  phonePattern = "^(\\d{10})$";

  origin: any;
  destination: any;
  flights: any;
  travelers: any;

  travelerFormGroup: FormGroup;
  isLinear = true;
  date = new FormControl(new Date());
  minDate = new Date();
  maxDate = new Date();

  message: '';

  loggedname: any;
  _user: User[];

  //countrylist: string[] = ['Australia', 'Brazil', 'Canada', 'India', 'USA'];
  countrylist: string[] = environment.COUNTRY_LIST;
  issuecountryfilteredOptions: Observable<string[]>;
  citizenshipcountryfilteredOptions: Observable<string[]>;
  residencecountryfilteredOptions: Observable<string[]>;

  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.travelerFormGroup.get('formArray'); }

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private authService: AuthService,
    private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.authService.getLoggedInUsers().subscribe(_ => {
      this._user = _
    }
    );
    /*this.loggedInUserItems$ = this.authService.getLoggedInUsers();
    this.loggedInUserItems$.subscribe(_ => {
      this._user = _;
      this.loggedInUserItems = _;
      this.loggedname = this.loggedInUserItems["0"].username;
    });*/
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    this.flights = JSON.parse(localStorage.getItem('flights'));
    this.travelers = JSON.parse(localStorage.getItem('travelers'));
    //let flightsarrayLength = JSON.parse(localStorage.getItem('flights')).length;
    //let ftravelersarrayLength = JSON.parse(localStorage.getItem('travelers')).length;

    this.travelerFormGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          firstnameCtrl: [(this.travelers !== null) ? this.travelers.formArray["0"].firstnameCtrl : null, Validators.required],
          middlenameCtrl: [(this.travelers !== null) ? this.travelers.formArray["0"].middlenameCtrl : null, Validators.nullValidator],
          lastnameCtrl: [(this.travelers !== null) ? this.travelers.formArray["0"].lastnameCtrl : null, Validators.required],
        }),
        this.formBuilder.group({
          addressControl: [(this.travelers !== null) ? this.travelers.formArray["1"].addressControl : null, Validators.required],
          zipcodeControl: [(this.travelers !== null) ? Number(this.travelers.formArray["1"].zipcodeControl) : null, Validators.compose([Validators.minLength(5), Validators.required])],
          emailControl: [(this.travelers !== null) ? this.travelers.formArray["1"].emailControl : null, Validators.compose([Validators.email, Validators.required])],
          phoneControl: [(this.travelers !== null) ? Number(this.travelers.formArray["1"].phoneControl) : null, Validators.compose([Validators.pattern(this.phonePattern), Validators.required])]
        }),
        this.formBuilder.group({
          specialserviceControl: [(this.travelers !== null) ? this.travelers.formArray["2"].specialserviceControl : null, Validators.required],
          seatpreferenceControl: [(this.travelers !== null) ? this.travelers.formArray["2"].seatpreferenceControl : null, Validators.required],
          mealpreferenceControl: [(this.travelers !== null) ? this.travelers.formArray["2"].mealpreferenceControl : null, Validators.required],
        }),
        this.formBuilder.group({
          passportneededControl: [(this.travelers !== null) ? Boolean(this.travelers.formArray["3"].passportneededControl) : null, Validators.required],
          passportnoControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportnoControl : null, Validators.required],
          passportissuecountryControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportissuecountryControl : null, Validators.required],
          passportissuedateControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportissuedateControl : null, Validators.required],
          passportexpirydateControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportexpirydateControl : null, Validators.required],
          passportcountryofcitizenshipControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportcountryofcitizenshipControl : null, Validators.required],
          passportcountryofresidenceControl: [(this.travelers !== null) ? this.travelers.formArray["3"].passportcountryofresidenceControl : null, Validators.required],
          emergencycontactfirstnameControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactfirstnameControl : null, Validators.required],
          emergencycontactmiddlenameControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactmiddlenameControl : null, Validators.nullValidator],
          emergencycontactlastnameControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactlastnameControl : null, Validators.required],
          emergencycontactaddressControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactaddressControl : null, Validators.required],
          emergencycontactzipcodeControl: [(this.travelers !== null) ? Number(this.travelers.formArray["3"].emergencycontactzipcodeControl) : null, Validators.compose([Validators.minLength(5), Validators.required])],
          emergencycontactemailControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactemailControl : null, Validators.compose([Validators.email, Validators.required])],
          //emergencycontactphoneControl: [(this.travelers !== null) ? this.travelers.formArray["3"].emergencycontactphoneControl : null, Validators.compose( [ Validators.minLength(9), Validators.required ] )]
          emergencycontactphoneControl: [(this.travelers !== null) ? Number(this.travelers.formArray["3"].emergencycontactphoneControl) : null, Validators.compose([Validators.pattern(this.phonePattern), Validators.nullValidator])]
        })
      ])
    });

    this.issuecountryfilteredOptions = this.travelerFormGroup.get('formArray.3.passportissuecountryControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.citizenshipcountryfilteredOptions = this.travelerFormGroup.get('formArray.3.passportcountryofcitizenshipControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.residencecountryfilteredOptions = this.travelerFormGroup.get('formArray.3.passportcountryofresidenceControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.onChanges();

    this.loading = false;
  }

  goBack(): void {
    this.location.back();
  }

  onChanges() {
    this.travelerFormGroup.get('formArray.3.passportneededControl').valueChanges
      .subscribe(selectedOption => {
        if (selectedOption === 'false') {
          this.travelerFormGroup.get('formArray.3.passportnoControl').reset();
          this.travelerFormGroup.get('formArray.3.passportnoControl').disable();
          this.travelerFormGroup.get('formArray.3.passportissuecountryControl').reset();
          this.travelerFormGroup.get('formArray.3.passportissuecountryControl').disable();
          this.travelerFormGroup.get('formArray.3.passportissuedateControl').reset();
          this.travelerFormGroup.get('formArray.3.passportissuedateControl').disable();
          this.travelerFormGroup.get('formArray.3.passportexpirydateControl').reset();
          this.travelerFormGroup.get('formArray.3.passportexpirydateControl').disable();
          this.travelerFormGroup.get('formArray.3.passportcountryofcitizenshipControl').reset();
          this.travelerFormGroup.get('formArray.3.passportcountryofcitizenshipControl').disable();
          this.travelerFormGroup.get('formArray.3.passportcountryofresidenceControl').reset();
          this.travelerFormGroup.get('formArray.3.passportcountryofresidenceControl').disable();
        }
        else {
          this.travelerFormGroup.get('formArray.3.passportnoControl').enable();
          this.travelerFormGroup.get('formArray.3.passportissuecountryControl').enable();
          this.travelerFormGroup.get('formArray.3.passportissuedateControl').enable();
          this.travelerFormGroup.get('formArray.3.passportexpirydateControl').enable();
          this.travelerFormGroup.get('formArray.3.passportcountryofcitizenshipControl').enable();
          this.travelerFormGroup.get('formArray.3.passportcountryofresidenceControl').enable();
        }
      });
  }

  confirmFlight() {
    this.loading = true;
    localStorage.setItem('travelers', JSON.stringify(this.travelerFormGroup.value));
    this.loading = false;
    this.router.navigate(['flight-trip-summary'], { queryParams: { fromcity: this.origin, tocity: this.destination } });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    //const filterValue = (value !== null) ? value.toLowerCase() : value;
    return this.countrylist.filter(option => option.toLowerCase().includes(filterValue));
  }
}
