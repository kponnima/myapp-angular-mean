import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';
export interface Data {}
@Component({
  selector: 'app-flight-search-results',
  templateUrl: './flight-search-results.component.html',
  styleUrls: ['./flight-search-results.component.css']
})
export class FlightSearchResultsComponent implements OnInit  {
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flights: any;
  origin: any;
  destination: any;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier'];
  dataSource: FlightDataSource;
  message='';

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.origin,
        tocity: this.destination,
        //departDateTime: departDateTime
      }
    });

    this.findflights(Params);
  }

  findflights(Params:HttpParams){
    this.http.get('/api/flight-search-results', { params: Params }).subscribe(data => {
      this.flights = data;
      this.dataSource = new FlightDataSource(this.flights);
      console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
      this.message = err.error.msg;
    });
  }
}
export class FlightDataSource extends DataSource<any> {
  constructor(private data: Data[]) { 
    super()
  }
  connect(): Observable<Data[]> {
    return Observable.of(this.data);
  }
  disconnect() {
  }
}
