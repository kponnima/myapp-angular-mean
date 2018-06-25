import { Component, OnInit, Inject, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Moment } from 'moment';
import * as moment from 'moment';

import {ShoppingcartComponent} from '../shoppingcart/shoppingcart.component';

export interface FlightData {
  flight_no: Number;
  origin: string;
  destination: string;
  departuredatetime: string;
  arrivaldatetime: string;
  aircraft_id: Number;
  carrier: string;
  duration: Number;
  miles: Number;
  inventory_id: Number;
  equipment_id: Number;
  cabintype:String;
  aircraftcapacity:Number;
  legseatsavailable:Number;
  baseseatssold:Number
}
@Component({
  selector: 'app-flight-search-results',
  templateUrl: './flight-search-results.component.html',
  styleUrls: ['./flight-search-results.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FlightSearchResultsComponent implements OnInit  {
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flights: any;
  origin: any;
  destination: any;
  displayedColumns = ['select','flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier'];
  dataSource: FlightDataSource;
  columnsToDisplay = [];
  //flightData: Observable<FlightData>;
  //flightdata: FlightData[] =[];
  //dataSource = new MatTableDataSource<FlightData>(this.flightdata);
  selection = new SelectionModel<FlightData>(true, []);
  //private flightsdataSubject = new BehaviorSubject<FlightData[]>([]);
  //dataChange: BehaviorSubject<FlightData[]> = new BehaviorSubject<FlightData[]>([]);
  //get data(): FlightData[] { return this.dataChange.value};
  //matTableDataSource = new MatTableDataSource<FlightData>(this.data.slice());
  expandedElement: FlightData;
  isDescriptionRow = (index, element) => element.cabintype;
  message='';

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public dialog: MatDialog) { 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.origin,
        tocity: this.destination,
        //departDateTime: departDateTime
      }
    });

    this.findflights(Params);
  }

  findflights(Params:HttpParams){
    //this.http.get<FlightData>('/api/flight-search-results', { params: Params }).subscribe(data => {
    this.http.get('/api/flight-search-results', { params: Params }).subscribe(data => {
      this.flights = data;
      this.dataSource = new FlightDataSource(this.flights);
      //this.flightData = Observable.of(data);
      console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
      this.message = err.error.msg;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    
    const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length;
    //const numSelected = 4;
    const numRows = 4;
    //const numRows = this.data.length;
    //const numRows = this.matTableataSource.data.length;
    console.log(numRows);
    console.log(numSelected);

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  /*masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      //this.matTableDataSource.data.forEach(row => this.selection.select(row));
      //this.data.forEach(row => this.selection.select(row));
      this.dataSource.data.forEach(row => this.selection.select(row));
  }*/
  
  getTotalFlightsSelected() {
    return this.selection.selected.length;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  openShoppingCart(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
          id: 1,
          title: 'Angular For Beginners'
    };

    let dialogRef = this.dialog.open(ShoppingcartComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
export class FlightDataSource extends DataSource<any> {
  constructor(private data: FlightData[]) { 
    super()
  }
  connect(): Observable<FlightData[]> {
    return Observable.of(this.data);
  }
  disconnect() {
  }
}