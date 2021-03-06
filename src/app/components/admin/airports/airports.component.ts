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

import { Airport } from '../../../models/airport';

import { AirportService } from '../../../services/airport.service';
import { MessageService } from '../../../helpers/message.service';
@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html'
})
export class AirportsComponent implements OnInit {
  loading: boolean = true;
  @Input() airport: Airport;
  airports: any;
  displayedColumns = ['index', 'airportcode', 'airportname', 'cityname', 'countrycode', 'countryname'];
  dataSource: AirportDataSource;

  constructor(private airportService: AirportService, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllAirports();
  }

  getAllAirports() {
    this.airportService.getAirports()
      .subscribe(data => {
        //console.log(data);
        this.airports = data;
        this.dataSource = new AirportDataSource(this.airports);
        this.loading = false;
      });
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
export class AirportDataSource extends DataSource<Airport> {
  constructor(private data: Airport[]) {
    super()

  }
  connect(): Observable<Airport[]> {
    return of(this.data);
  }
  disconnect() {
  }
}
