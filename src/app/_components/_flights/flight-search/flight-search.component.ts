import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith, debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Airport } from '../../../_models/airport';

import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';
import { AirportService } from '../../../_services/airport.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {
  loading: boolean = false;
  airportsloading: boolean = false;
  viewAdvancedSearchFlag: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  date = new FormControl(new Date());
  minDate = new Date();
  minReturnDate = moment().add(1, "days");
  returndate = new FormControl(this.minReturnDate);
  maxDate = new Date(2020, 12, 1);

  flightsearchparams: any;
  flightsearchForm: FormGroup;
  fromairportfilteredOptions: Observable<Airport[]>;
  toairportfilteredOptions: Observable<Airport[]>;
  connectionairportfilteredOptions: Observable<Airport[]>;
  @ViewChild(MatDatepicker, { static: false }) picker: MatDatepicker<Moment>;
  isValidMoment: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  message = '';

  typeofTravels = [
    { value: 'typeoftravel-0', viewValue: 'One Way' },
    { value: 'typeoftravel-1', viewValue: 'Round Trip' },
    { value: 'typeoftravel-2', viewValue: 'Multi City' }
  ];

  typeofTravelers = [
    { value: 'typeoftravelers-0', viewValue: '1 Passenger' },
    { value: 'typeoftravelers-1', viewValue: '2 Passengers' },
    { value: 'typeoftravelers-2', viewValue: '3 Passengers' },
    { value: 'typeoftravelers-3', viewValue: '4 Passengers' },
    { value: 'typeoftravelers-4', viewValue: '5 Passengers' },
    { value: 'typeoftravelers-5', viewValue: '6 Passengers' },
    { value: 'typeoftravelers-6', viewValue: '7 Passengers' },
    { value: 'typeoftravelers-7', viewValue: '8 Passengers' },
    { value: 'typeoftravelers-8', viewValue: '9 Passengers' },
  ];

  classofTravels = [
    { value: 'classoftravel-0', viewValue: 'Economy' },
    { value: 'classoftravel-1', viewValue: 'Premium Economy' },
    { value: 'classoftravel-2', viewValue: 'Business' },
    { value: 'classoftravel-3', viewValue: 'First' }
  ];

  currencyTypes = [
    { value: 'currencyType-0', viewValue: 'Money' },
    { value: 'currencyType-1', viewValue: 'Miles' }
  ]

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private service: MessageService, private airportService: AirportService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.flightsearchparams = JSON.parse(localStorage.getItem('flightsearchparams'));
    // this.flightsearchparams = '';

    this.flightsearchForm = this.formBuilder.group({
      'typeoftravel': [(this.flightsearchparams !== null) ? this.flightsearchparams.typeoftravel : null, Validators.required],
      'typeoftraveler': [(this.flightsearchparams !== null) ? this.flightsearchparams.typeoftraveler : null, Validators.required],
      'classoftravel': [(this.flightsearchparams !== null) ? this.flightsearchparams.classoftravel : null, Validators.required],
      'fromcity': [(this.flightsearchparams !== null) ? this.flightsearchparams.fromcity : null, Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      'tocity': [(this.flightsearchparams !== null) ? this.flightsearchparams.tocity : null, Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      'connection_city': [(this.flightsearchparams !== null) ? this.flightsearchparams.connection_city : null, Validators.nullValidator],
      'depart_date': [(this.flightsearchparams !== null) ? this.flightsearchparams.depart_date : null, Validators.required],
      'return_date': [(this.flightsearchparams !== null) ? this.flightsearchparams.return_date : null, Validators.nullValidator],
      'currency_type': [(this.flightsearchparams !== null) ? this.flightsearchparams.currency_type : null, Validators.nullValidator],
      'include_nearby': [(this.flightsearchparams !== null) ? this.flightsearchparams.include_nearby : null, Validators.nullValidator],
      'refundable_fares': [(this.flightsearchparams !== null) ? this.flightsearchparams.refundable_fares : null, Validators.nullValidator],
    });

    this.flightsearchForm.controls.typeoftravel.value === null ? this.flightsearchForm.get('typeoftravel').setValue(this.typeofTravels[1].viewValue) : this.flightsearchForm.controls.typeoftravel.value;
    // this.flightsearchForm.get('typeoftravel').setValue(this.typeofTravels[0].viewValue);
    this.flightsearchForm.get('typeoftraveler').setValue(this.typeofTravelers[0].viewValue);
    this.flightsearchForm.get('classoftravel').setValue(this.classofTravels[0].viewValue);
    this.flightsearchForm.controls.depart_date.value === null ? this.flightsearchForm.get('depart_date').setValue(this.minDate) : this.flightsearchForm.controls.depart_date.value;
    this.flightsearchForm.get('return_date').setValue(this.minReturnDate);
    this.flightsearchForm.get('currency_type').setValue(this.currencyTypes[0].viewValue);

    this.fromairportfilteredOptions = this.flightsearchForm.get('fromcity').valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.airportsloading = true),
        switchMap(val =>
          ((val === null) || (val.length !== 3)) ? of([]) : this.airportService.getAirportByCode(this._formatCase(val))
        ),
        tap(() => this.airportsloading = false)
      );

    this.toairportfilteredOptions = this.flightsearchForm.get('tocity').valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.airportsloading = true),
        switchMap(val =>
          ((val === null) || (val.length !== 3)) ? of([]) : this.airportService.getAirportByCode(this._formatCase(val))
        ),
        tap(() => this.airportsloading = false)
      );

    this.connectionairportfilteredOptions = this.flightsearchForm.get('connection_city').valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.airportsloading = true),
        switchMap(val =>
          ((val === null) || (val.length !== 3)) ? of([]) : this.airportService.getAirportByCode(this._formatCase(val))
        ),
        tap(() => this.airportsloading = false)
      );
  }

  ngAfterViewInit() {
    this.picker._selectedChanged.subscribe(
      (newDate: Moment) => {
        this.isValidMoment = moment.isMoment(newDate);
      },
      (error) => {
        throw Error(error);
      }
    );
  }

  swapCity() {
    let currentfromcityVal = this.flightsearchForm.get('fromcity').value;
    let currenttocityVal = this.flightsearchForm.get('tocity').value;
    currentfromcityVal === null ? this.flightsearchForm.get('tocity').setValue(null) : this.flightsearchForm.get('tocity').setValue(currentfromcityVal);
    currenttocityVal === null ? this.flightsearchForm.get('fromcity').setValue(null) : this.flightsearchForm.get('fromcity').setValue(currenttocityVal);
  }

  viewAdvancedSearch() {
    this.viewAdvancedSearchFlag === false ? this.viewAdvancedSearchFlag = true : this.viewAdvancedSearchFlag = false;
  }

  flightsearch(form: NgForm) {
    localStorage.setItem('flightsearchparams', JSON.stringify(this.flightsearchForm.value))
    let departDateTime = moment(this.flightsearchForm.get('depart_date').value)
      //.add(this.flightsearchForm.controls.depart_time.value, 'hours')
      //.format(this.DATE_DATA_FORMAT)
      .toISOString();
    let returnDateTime = moment(this.flightsearchForm.controls.return_date.value)
      //.add(this.flightsearchForm.controls.depart_time.value, 'hours')
      //.format(this.DATE_DATA_FORMAT)
      .toISOString();

    if (this.flightsearchForm.controls.typeoftravel.value === 'Round Trip') {
      this.router.navigate(['flight-search-results'], {
        queryParams: {
          fromcity: this.flightsearchForm.controls.fromcity.value,
          tocity: this.flightsearchForm.controls.tocity.value,
          return: true,
          departuredatetime: departDateTime,
          arrivaldatetime: returnDateTime
        }
      });
    } else {
      this.router.navigate(['flight-search-results'], {
        queryParams: {
          fromcity: this.flightsearchForm.controls.fromcity.value,
          tocity: this.flightsearchForm.controls.tocity.value,
          return: false,
          departuredatetime: departDateTime
        }
      });
    }
  }

  /*   getlistofAirports() {
     this.filteredAirports = JSON.parse(localStorage.getItem('airports'));
      //console.log(this.filteredAirports);
      for(let i=0; i < this.filteredAirports.length; i++){
        let entry = this.filteredAirports[""+ i].airportcode;
        //console.log(entry);
        this.airportfilteredOptions.push(entry);
      }
      console.log(this.airportfilteredOptions);
    } */

  sendMessage(message: string): void {
    // send message to subscribers via observable subject
    //this.service.sendMessage(message);
    this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
  }

  clearMessage(): void {
    this.service.clearMessage();
  }

  handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      console.log("Client-side error occured.");
      console.log(err);
    } else {
      console.log("Server-side error occured.");
      console.log(err);
    }
    return Observable.throw(err.message)
  }

  _formatCase(value: string): string {
    let formatted_string = value.toUpperCase();
    return formatted_string;
  }
}