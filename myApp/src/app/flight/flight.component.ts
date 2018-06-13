import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable, of } from 'rxjs';
import 'rxjs/add/Observable/of';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit, OnDestroy {
  private sub : any;
  private flight_no: any;
  private origin: any;
  private destination: any;
  private departure: any;
  private arrival: any;
  private aircraft_id: any;
  private carrier: any;
  private duration: any;
  private miles: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.flight_no = +params['flight_no'];
      console.log(this.flight_no);
      this.origin = +params['origin'];
      this.destination = +params['destination'];
      this.arrival = +params['arrival'];
      this.aircraft_id = +params['aircraft_id'];
      this.carrier = +params['carrier'];
      this.duration = +params['duration'];
      this.miles = +params['miles'];
   });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
