import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import { Observable, of } from 'rxjs';
import 'rxjs/add/Observable/of';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

export interface Data {}

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  flights: any;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier'];
  dataSource: FlightDataSource;


  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver) { 
    const isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        //this.activateHandsetLayout();
      }
    });
  }

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/flights', httpOptions).subscribe(data => {
      this.flights = data;
      this.dataSource = new FlightDataSource(this.flights);
      console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }
  
  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
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
