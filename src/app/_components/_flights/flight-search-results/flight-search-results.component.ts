import { Component, OnInit, Inject, TemplateRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay'
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { ShoppingcartComponent } from '../shoppingcart/shoppingcart.component';
import { Flight } from '../../../_models/flight';

import { CartService } from '../../../_services/cart.service';
import { FlightService } from '../../../_services/flight.service';

@Component({
  selector: 'app-flight-search-results',
  templateUrl: './flight-search-results.component.html',
  styleUrls: ['./flight-search-results.component.scss']
})
export class FlightSearchResultsComponent implements OnInit {
  loading: Boolean = true;
  // @Input() flight: Flight;
  DATE_DATA_FORMAT = 'YYYY-MM-DD';
  flights: Flight[];
  // returnflights: any;
  origin: any;
  destination: any;
  returnflag: any;
  departDateTime: any;
  arrivalDateTime: any;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier', 'price', 'duration'];
  selection = new SelectionModel<Flight>(true, []);
  // expandedElement: Flight;
  // alreadyExpanded: Boolean = false;
  message = '';
  datalength: number = 0;
  //flightduration: any;
  isOutboundSelected: Boolean = false;
  changeFlight: any;

  //@ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private http: HttpClient, private dialog: MatDialog,
    private flightService: FlightService, private cartService: CartService, private overlay: Overlay) {
    this.loading = true;
    this.shoppingCartItems$ = this
      .cartService
      .getItems();

    this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);
  }

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
      this.returnflag = params['return'];
      this.departDateTime = params['departuredatetime'];
      // this.arrivalDateTime = (this.returnflag === "true") ? params['arrivaldatetime'] : null;
      this.arrivalDateTime = params['arrivaldatetime'];
    });

    let departDate = moment(this.departDateTime)
      .format(this.DATE_DATA_FORMAT);
    //console.log(departDate);

    let Params: any;
    if (this.returnflag === "true") {
      let arrivalDate = moment(this.arrivalDateTime)
        .format(this.DATE_DATA_FORMAT);
      //console.log(arrivalDate);

      Params = new HttpParams({
        fromObject: {
          fromcity: this.origin,
          tocity: this.destination,
          return: this.returnflag,
          departDateTime: departDate,
          arrivalDatetime: arrivalDate
        }
      });
    } else {
      Params = new HttpParams({
        fromObject: {
          fromcity: this.origin,
          tocity: this.destination,
          return: this.returnflag,
          departDateTime: departDate
        }
      });
    }
    //console.log(Params);
    this.findflights(Params);
  }

  findflights(Params: HttpParams) {
    //this.http.get<FlightData>('/api/flight-search-results', { params: Params }).subscribe(data => {
    //this.http.get('/api/flight-search-results', { params: Params }).subscribe(data => {
    this.flightService.getFlightsBySearchParams(Params).subscribe(data => {
      this.flights = data;
      this.datalength = this.flights.length;
      this.loading = false;
    }, err => {
      this.loading = false;
      if (err.status === 401) {
        this.router.navigate(['login']);
      }
      this.message = err.error.msg;
    });
  }

  public getHours(milliseconds: number) {
    return moment.utc(milliseconds).format('HH');
  }
  public getMinutes(milliseconds: number) {
    return moment.utc(milliseconds).format('mm');
  }

  addFlightToCart(row: Flight) {
    //alert(row['flight_no']);
    if (!this.selection.isSelected(row)) {
      this.cartService.addToCart(row);
      localStorage.setItem('flights', JSON.stringify(row));
    } else {
      this.cartService.removeFromCart(row);
      localStorage.removeItem('flights');
    }
  }

  isEmpty() {
    //console.log(this.datalength);
    if (this.datalength === 0 && !this.loading) {
      return true;
    }
    return false;
  }

  goBack(): void {
    this.location.back();
  }
}