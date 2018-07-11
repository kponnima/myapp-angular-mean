import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { MatSnackBar, MatDatepicker, TooltipPosition } from '@angular/material';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Airport } from '../_models/airport';

import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';
import { AirportService } from '../_services/airport.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  private loading: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flightsearchForm: FormGroup;
  airportcodes$: Observable<Airport[]>;

  public cols: Observable<number>;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Moment>;
  isValidMoment: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  checked = false;
  message = '';

  typeofTravel = [
    { value: 'typeoftravel-0', viewValue: 'One Way' },
    { value: 'typeoftravel-1', viewValue: 'Round Trip' },
    { value: 'typeoftravel-2', viewValue: 'Multi City' }
  ];

  typeofTravelers = [
    { value: 'typeoftravelers-0', viewValue: 'Adult - 1' },
    { value: 'typeoftravelers-1', viewValue: 'Couple' },
    { value: 'typeoftravelers-2', viewValue: 'Adult + Children' }
  ];

  classofTravel = [
    { value: 'clasoftravel-0', viewValue: 'Economy' },
    { value: 'clasoftravel-1', viewValue: 'Premium Economy' },
    { value: 'clasoftravel-2', viewValue: 'Business' },
    { value: 'clasoftravel-3', viewValue: 'First' }
  ];

  constructor(private observableMedia: ObservableMedia, private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private service: MessageService, private airportService: AirportService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.flightsearchForm = this.formBuilder.group({
      'typeoftravel': ['', Validators.required],
      'typeoftraveler': ['', Validators.required],
      'classoftravel': ['', Validators.required],
      'fromcity': [null, Validators.required],
      'tocity': [null, Validators.required],
      'connection_city': [null, Validators.nullValidator],
      'depart_date': [{ value: null, disabled: true }, Validators.required],
      'return_date': [{ value: null, disabled: true }, Validators.nullValidator],
    });

    this.flightsearchForm.get('typeoftravel').setValue(this.typeofTravel[1].viewValue);
    this.flightsearchForm.get('typeoftraveler').setValue(this.typeofTravelers[0].viewValue);
    this.flightsearchForm.get('classoftravel').setValue(this.classofTravel[0].viewValue);

    this.getlistofAirports();

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
    this.cols = this.observableMedia.asObservable().pipe(
      map(change => {
        //console.log(change);
        //console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      }),
      startWith(start));
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

  flightsearch(form: NgForm) {
    /*let departDateTime = moment(this.flightsearchForm.controls.depart_date.value)
      .add(this.flightsearchForm.controls.depart_time.value, 'hours')
      .format(this.DATE_DATA_FORMAT)*/

    this.router.navigate(['flight-search-results'], { queryParams: { fromcity: this.flightsearchForm.controls.fromcity.value, 'tocity': this.flightsearchForm.controls.tocity.value } });
  }

  getlistofAirports() {
    this.airportcodes$ = this.airportService.getAirports()
      .pipe(
        map(data => _.values(data)),
        shareReplay())
      .catch(this.handleError);
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