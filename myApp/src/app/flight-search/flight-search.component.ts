import { Component, OnInit , ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { startWith, map} from 'rxjs/operators';
import { MatDatepicker, TooltipPosition } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';
export interface Data {
  codes: string[];
  names: string[];
}
@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flightsearchForm: FormGroup;
  airports: any;
  dataSource: AirportDataSource;
  displayedColumns = [ 'airportcode', 'airportname' ];
  panelOpenState: boolean = false;
  @ViewChild( MatDatepicker) picker: MatDatepicker<Moment>;
  isValidMoment: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  checked = false;
  message = '';

  typeofTravel = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  times = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.flightsearchForm = this.formBuilder.group({
      'typeoftravel' : ['', Validators.required],
      'fromcity' : [null, Validators.required],
      'tocity' : [null, Validators.required],
      'connection_city' : [null, Validators.nullValidator],
      'depart_date' : [null, Validators.required],
      'depart_time' : [null, Validators.required],
      'return_date' : [null, Validators.nullValidator],
      'return_time' : [null, Validators.nullValidator]
    });
    this.getAirportCodes()
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
  getAirportCodes(){
    this.http.get('/api/airports').subscribe(data => {
      this.airports = data;
      this.dataSource = new AirportDataSource(this.airports);
      console.log(this.airports);
    }, err => {
      this.message = err.error.msg;
    });
  }
  flightsearch(form:NgForm){
    let departDateTime = moment(this.flightsearchForm.controls.depart_date.value).add(this.flightsearchForm.controls.depart_time.value, 'hours').format(this.DATE_DATA_FORMAT)

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.flightsearchForm.controls.fromcity.value,
        tocity: this.flightsearchForm.controls.tocity.value,
        //departDateTime: departDateTime
      }
    });
    this.router.navigate(['flight-search-results'],{ queryParams: { fromcity: this.flightsearchForm.controls.fromcity.value, 'tocity': this.flightsearchForm.controls.tocity.value } });
  }
  /*flightsearch(form:NgForm){

    let departDateTime = moment(this.flightsearchForm.controls.depart_date.value).add(this.flightsearchForm.controls.depart_time.value, 'hours').format(this.DATE_DATA_FORMAT)

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.flightsearchForm.controls.fromcity.value,
        tocity: this.flightsearchForm.controls.tocity.value,
        //departDateTime: departDateTime
      }
    });

    this.http.get('/api/flight-search-results', { params: Params }).subscribe(resp => {
      //console.log(resp);
      this.router.navigate(['flight-search-results']);
    }, err => {
      this.message = err.error.msg;
    });
  }*/
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}

export class AirportDataSource extends DataSource<any> {
  constructor(private data: Data[]) { 
    super()
  }
  connect(): Observable<Data[]> {
    return Observable.of(this.data);
  }
  disconnect() {
  }
}