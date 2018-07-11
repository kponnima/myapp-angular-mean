import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatDatepicker, TooltipPosition } from '@angular/material';

import { Airport } from '../../../_models/airport';

import { AirportService } from '../../../_services/airport.service';
import { MessageService } from '../../../_helpers/message.service';
@Component({
  selector: 'app-airport-detail',
  templateUrl: './airport-detail.component.html',
  styleUrls: ['./airport-detail.component.css']
})
export class AirportDetailComponent implements OnInit {
  private loading: boolean = true;
  airport: {};
  airport_code:string = '';

  constructor(private airportService: AirportService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAirportDetails(this.route.snapshot.params['airportcode']);
  }

  getAirportDetails(airport_code) {
    this.airportService.getAirportByCode(airport_code)
      .subscribe(data => {
        //console.log(data);
        //this.airport = data;
        this.airport = data["0"];
        this.airport_code = data["0"].airportcode;
        this.loading = false;
      });
  }

  deleteAirport(airport_code) {
    this.loading = true;
    this.airportService.deleteAirport(airport_code)
      .subscribe(res => {
        this.sendMessage('Airport [' + airport_code + '] deleted successfully! ');
        this.router.navigate(['/airports']);
        this.loading = false;
      }, (err) => {
        console.log(err);
        this.loading = false;
        this.sendMessage('Failed to deleted airport with no '+ airport_code);
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
