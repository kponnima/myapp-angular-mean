import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Flight } from '../../../_models/flight';

import { FlightService } from '../../../_services/flight.service';
import { MessageService } from '../../../_helpers/message.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.scss']
})
export class FlightDetailComponent implements OnInit {
  loading: boolean = true;
  flight: {};
  flight_no:number;
  origin:string;
  destination: string;
  departuredatetime: string;
  arrivaldatetime: string;
  aircraft_id: number;
  price: number;
  carrier: string;
  duration: number;
  miles: number;
  inventory_id: number;
  equipment_id: number;


  constructor(private flightService: FlightService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getFlightDetails(this.route.snapshot.params['flight_no']);
  }

  getFlightDetails(flight_no: number) {
    this.loading = true;
    this.flightService.getFlightById(flight_no)
      .subscribe(data => {
        //console.log(data);
        //this.flight = data;
        this.flight = data["0"];
        this.flight_no = data["0"].flight_no;
        this.loading = false;
      });
  }

  deleteFlight(flight_no: number) {
    this.loading = true;
    this.flightService.deleteFlight(flight_no)
      .subscribe(res => {
        this.sendMessage('Flight no [' + flight_no + '] deleted successfully! ');
        this.loading = false;
        this.router.navigate(['/flights']);
      }, (err) => {
        console.log(err);
        this.loading = false;
        this.sendMessage('Failed to deleted flight with no '+ flight_no);
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
