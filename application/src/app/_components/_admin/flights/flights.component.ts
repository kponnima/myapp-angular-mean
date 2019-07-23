import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Flight } from '../../../_models/flight';

import { MessageService } from '../../../_helpers/message.service';
import { FlightService } from '../../../_services/flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  private loading: boolean = true;
  @Input() flight: Flight;
  flights: any;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival'];
  dataSource: FlightDataSource;

  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllFlights();
  }

  getAllFlights() {
    this.loading = true;
    this.flightService.getFlights()
      .subscribe(data => {
        //console.log(data);
        this.flights = data;
        this.dataSource = new FlightDataSource(this.flights);
        this.loading = false;
      });
  }

  deleteFlight(id: number) {
    this.flightService.deleteFlight(id)
      .subscribe(res => {
        this.router.navigate(['/flights']);
      }, (err) => {
        console.log(err);
      }
      );
  }

  goBack(): void {
    this.location.back();
  }

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
}
export class FlightDataSource extends DataSource<Flight> {
  constructor(private data: Flight[]) {
    super()

  }
  connect(): Observable<Flight[]> {
    return of(this.data);
  }
  disconnect() {
  }
}
