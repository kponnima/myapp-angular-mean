import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MessageService } from '../common-services/message.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../common-services/auth.service';
export interface Data {}
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
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
      console.log(this.flights);
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
