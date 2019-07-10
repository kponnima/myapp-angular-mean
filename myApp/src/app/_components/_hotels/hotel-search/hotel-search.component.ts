import { Component, OnInit , ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';

export interface AirportGroup {
  airportcode: string;
  airportname: string;
}

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css']
})
export class HotelSearchComponent implements OnInit {
  private loading: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flightsearchForm: FormGroup;
  cityForm: FormGroup = this.formBuilder.group({
    cityGroup: '',
  });
  airportcodes$: Observable<AirportGroup[]>;
  
  public cols: Observable<number>;
   @ViewChild(MatDatepicker, { static: true }) picker: MatDatepicker<Moment>;
  isValidMoment: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  checked = false;
  message = '';

  typeofTravel = [
    {value: 'typeoftravel-0', viewValue: 'One Way'},
    {value: 'typeoftravel-1', viewValue: 'Round Trip'},
    {value: 'typeoftravel-2', viewValue: 'Multi City'}
  ];

  typeofTravelers = [
    {value: 'typeoftravelers-0', viewValue: 'Adult - 1'},
    {value: 'typeoftravelers-1', viewValue: 'Couple'},
    {value: 'typeoftravelers-2', viewValue: 'Adult + Children'}
  ]; 

  classofTravel = [
    {value: 'clasoftravel-0', viewValue: 'Economy'},
    {value: 'clasoftravel-1', viewValue: 'Premium Economy'},
    {value: 'clasoftravel-2', viewValue: 'Business'},
    {value: 'clasoftravel-3', viewValue: 'First'}
  ];

  times = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  constructor(private observableMedia: ObservableMedia, private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private service:MessageService, private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.flightsearchForm = this.formBuilder.group({
      'typeoftravel' : ['', Validators.required],
      'typeoftraveler' : ['', Validators.required],
      'classoftravel' : ['', Validators.required],
      'fromcity' : [null, Validators.required],
      'tocity' : [null, Validators.required],
      'connection_city' : [null, Validators.nullValidator],
      'depart_date' : [{value: null, disabled: true}, Validators.required],
      'depart_time' : [null, Validators.required],
      'return_date' : [{value: null, disabled: true}, Validators.nullValidator],
      'return_time' : [null, Validators.nullValidator]
    });

    this.flightsearchForm.get('typeoftravel').setValue(this.typeofTravel[0].viewValue);
    this.flightsearchForm.get('typeoftraveler').setValue(this.typeofTravelers[0].viewValue);
    this.flightsearchForm.get('classoftravel').setValue(this.classofTravel[0].viewValue);

    this.filterAirportGroup();

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
        console.log(change);
        console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      }),
      startWith(start));
  }

  ngAfterViewInit(){
    this.picker._selectedChanged.subscribe(
      (newDate: Moment) => {
        this.isValidMoment = moment.isMoment(newDate);
      },
      (error) => {
        throw Error(error);
      }
    );
  }

  flightsearch(form:NgForm){
    let departDateTime = moment(this.flightsearchForm.controls.depart_date.value)
      .add(this.flightsearchForm.controls.depart_time.value, 'hours')
      .format(this.DATE_DATA_FORMAT)

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.flightsearchForm.controls.fromcity.value,
        tocity: this.flightsearchForm.controls.tocity.value,
        //departDateTime: departDateTime
      }
    });
    this.router.navigate(['flight-search-results'],{ queryParams: { fromcity: this.flightsearchForm.controls.fromcity.value, 'tocity': this.flightsearchForm.controls.tocity.value } });
  }

  filterAirportGroup(){
    this.airportcodes$ = this.http.get<AirportGroup[]>('/api/airports')
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

  clearMessage():void{
    this.service.clearMessage();
  }

  private handleError(err : HttpErrorResponse){
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

  fitListHeight = '600px';
}
