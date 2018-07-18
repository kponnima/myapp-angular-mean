import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith, finalize } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatDatepicker, TooltipPosition } from '@angular/material';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Airport } from '../../../_models/airport';
import { Flight } from '../../../_models/flight';

import { MessageService } from '../../../_helpers/message.service';
import { FlightService } from '../../../_services/flight.service';

@Component({
  selector: 'app-flight-create',
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.css']
})
export class FlightCreateComponent implements OnInit, OnChanges {
  private isLoading: boolean = false;
  private createloading: boolean = false;
  //private formSubmitAttempt: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-mm-ddTHH:mm:ssZ';

  flightCreateForm: FormGroup;
  airportcodes$: Observable<Airport[]>;
  data: any;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Moment>;
  minDate = new Date();
  maxDate = new Date(2020, 12, 1);
  isValidMoment: boolean = false;
  prepared: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  message = '';

  times = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM',
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  occurences: string[] = [
    'Once', 'Daily', 'Weekly'
  ];

  constructor(private flightService: FlightService, private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.flightCreateForm = this.formBuilder.group({
      'flight_no': [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )],
      'origin': [null, Validators.compose( [ Validators.minLength(3),Validators.maxLength(3), Validators.required ] )],
      'destination': [null, Validators.compose( [ Validators.minLength(3),Validators.maxLength(3), Validators.required ] )],
      'depart_date': [{ value: null, disabled: true }, Validators.required],
      'depart_time': [null, Validators.required],
      'arrival_date': [{ value: null, disabled: true }, Validators.required],
      'arrival_time': [null, Validators.required],
      'aircraft_id': [null, Validators.required],
      'price': [null, Validators.required],
      'carrier': [null, Validators.required],
      'duration' : [Number(8400000), Validators.nullValidator],
      'miles' : [Number(868), Validators.nullValidator],
      'inventory_id': [null, Validators.required],
      'equipment_id': [null, Validators.required]
    });

    this.filterAirportGroup();
  }

  ngAfterViewInit(): void {
    this.picker._selectedChanged.subscribe(
      (newDate: Moment) => {
        this.isValidMoment = moment.isMoment(newDate);
      },
      (error) => {
        throw Error(error);
      }
    );
  }

  ngOnChanges() {
    this.resetForm();
  }

  filterAirportGroup() {
    this.isLoading = true;
    this.airportcodes$ = this.http.get<Airport[]>('/api/airports')
      .pipe(
        map(airportdata => _.values(airportdata)),
        shareReplay(),
        finalize(() => this.isLoading = false)
      )
      .catch(this.handleError);
  }

  /*calculateDistance(lat1, lat2, lon1, lon2) {
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
  }*/

  flightCreate() {
    this.createloading = true;
    this.prepared = this.preflightCreate();
    //this.resetForm();
    if(this.prepared){
      this.flightService.createFlight(this.flightCreateForm.value).subscribe(resp => {
      //this.http.post('/api/flight-create', this.flightCreateForm.value).subscribe(resp => {
        this.data = resp;
        //console.log(this.data);
        if(!(this.data.success)){
          this.createloading = false;
          this.sendMessage(this.data.msg);
        }else{
          this.createloading = false;
          this.sendMessage(this.data.msg);
          this.router.navigate(['flights']);
        }
      }, err => {
        console.log(err);
        this.createloading = false;
        this.sendMessage(err);
        this.message = err.error.msg;
      });
    }
  }

  resetForm() {
    //console.log('I am invoked');
    this.flightCreateForm.reset;
    this.flightCreateForm.markAsPristine();
    this.flightCreateForm.markAsUntouched();
    this.flightCreateForm.updateValueAndValidity();
    this.flightCreateForm.clearValidators();
  }

  preflightCreate() {
    let depart_time_hour = moment(this.flightCreateForm.controls.depart_time.value, ["h:mm A"]).format("hh");
    let depart_time_minute = moment(this.flightCreateForm.controls.depart_time.value, ["h:mm A"]).format("mm");
    //let depart_time_second = moment(this.flightCreateForm.controls.depart_time.value, ["h:mm A"]).format("ss");

    let departDateTime = moment(this.flightCreateForm.controls.depart_date.value)
    .add(depart_time_hour, 'hours')
    .add(depart_time_minute, 'minutes')
    //.add(depart_time_second, 'seconds')
    //.format(this.DATE_DATA_FORMAT)
    .toISOString();

    //console.log(departDateTime);

    let arrival_time_hour = moment(this.flightCreateForm.controls.arrival_time.value, ["h:mm A"]).format("hh");
    let arrival_time_minute = moment(this.flightCreateForm.controls.arrival_time.value, ["h:mm A"]).format("mm");
    //let arrival_time_second = moment(this.flightCreateForm.controls.arrival_time.value, ["h:mm A"]).format("ss");

    let arrivalDateTime = moment(this.flightCreateForm.controls.arrival_date.value)
    .add(arrival_time_hour, 'hours')
    .add(arrival_time_minute, 'minutes')
    //.format(this.DATE_DATA_FORMAT)
    .toISOString();

    //console.log(arrivalDateTime);

    this.flightCreateForm.patchValue({
      depart_time: departDateTime,
      arrival_time: arrivalDateTime,
    });

    return moment(departDateTime).isValid();
    //return true;
  }

  goBack(): void {
    this.location.back();
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

  private handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      console.log("Client-side error occured.");
      console.log(err);
    } else {
      console.log("Server-side error occured.");
      console.log(err);
    }
    this.sendMessage(err);
    return Observable.throw(err.message)
  }

}
