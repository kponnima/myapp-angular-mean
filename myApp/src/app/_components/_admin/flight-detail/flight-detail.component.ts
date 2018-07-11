import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatDatepicker, TooltipPosition } from '@angular/material';

import { Flight } from '../../../_models/flight';

import { FlightService } from '../../../_services/flight.service';
import { MessageService } from '../../../_helpers/message.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit {
  flight: {};
  flightno:number;

  constructor(private flightService: FlightService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getFlightDetails(this.route.snapshot.params['flight_no']);
  }

  getFlightDetails(flight_no) {
    this.flightService.getFlightById(flight_no)
      .subscribe(data => {
        //console.log(data);
        //this.flight = data;
        this.flight = data["0"];
        this.flightno = data["0"].flight_no;
      });
  }

  deleteFlight(flight_no) {
    this.flightService.deleteFlight(flight_no)
      .subscribe(res => {
        this.sendMessage('Flight no [' + flight_no + '] deleted successfully! ');
        this.router.navigate(['/flights']);
      }, (err) => {
        console.log(err);
        this.sendMessage('Failed to deleted flight with no '+ flight_no);
      });
  }

  goBack(): void {
    this.location.back();
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

}
