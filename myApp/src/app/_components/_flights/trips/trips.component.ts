import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';

import { Moment } from 'moment';
import * as moment from 'moment';

import { Flight } from '../../../_models/flight';
import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  @Input() flight: Flight;
  panelOpenState: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flights: any;
  origin: any;
  destination: any;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier'];
  dataSource: FlightDataSource;
  message='';

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private service:MessageService, private snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    this.findflights();
  }

  findflights(){
    this.http.get('/api/flights').subscribe(data => {
      this.flights = data;
      this.dataSource = new FlightDataSource(this.flights);
      //console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
      this.message = err.error.msg;
    });
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
}
export class FlightDataSource extends DataSource<Flight> {
  constructor(private data: Flight[]) { 
    super();
  }
  connect(): Observable<Flight[]> {
    return of(this.data);
  }
  disconnect() {
  }
}
