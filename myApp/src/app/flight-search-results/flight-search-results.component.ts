import { Component, OnInit, Inject, TemplateRef, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay'
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, BehaviorSubject, of } from 'rxjs';
import 'rxjs/add/observable/of';

import { Moment } from 'moment';
import * as moment from 'moment';

import { ShoppingcartComponent } from '../shoppingcart/shoppingcart.component';
import { Flight } from '../_models/flight';
import { CartService } from '../_services/cart.service';
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
  @Input() flight: Flight;
  DATE_DATA_FORMAT = 'HH:mm:ssZ';
  flights: any;
  origin: any;
  destination: any;
  displayedColumns = ['select','flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id', 'carrier', 'price', 'details_button_col'];
  dataSource: FlightDataSource;
  selection = new SelectionModel<Flight>(true, []);
  expandedElement: Flight;
  alreadyExpanded:Boolean = false;
  isDescriptionRow = (index, element) => element.cabintype;
  message='';
  datalength:number = 0;
  //flightduration: any;

  //@ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private http: HttpClient, private dialog: MatDialog,
    private cartService: CartService, private overlay: Overlay) {
      
    this.shoppingCartItems$ = this
    .cartService
    .getItems();

    this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      //console.log(params);
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
    
    /*this.flightduration = moment(this.flights.duration)
                .format(this.DATE_DATA_FORMAT);
    console.log(this.flightduration);*/
  }

  findflights(Params:HttpParams){
    //this.http.get<FlightData>('/api/flight-search-results', { params: Params }).subscribe(data => {
    this.http.get('/api/flight-search-results', { params: Params }).subscribe(data => {
      this.flights = data;
      //console.log(this.flights);
      this.dataSource = new FlightDataSource(this.flights);
      //this.flightData = Observable.of(data);
      this.datalength = this.flights.length;
      //console.log(this.flights.length);
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
    //console.log('currently selected: ' +numSelected);
    const numRows = this.flights.length;
    //console.log('Datasource length: ' +numRows);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    //this.cartService.removeAllFromCart();
    this.isAllSelected() ?
      this.selection.clear() :
      this.flights.forEach(row => this.selection.select(row));
  }
  
  onDetailsButtonClick(element) {
    //console.log('Expanded value : ' + this.alreadyExpanded);
    if(this.alreadyExpanded){
      this.expandedElement = null;
      this.alreadyExpanded = false;
      //console.log('Collapsed');
    }else{
      this.expandedElement = element;
      this.alreadyExpanded = true;
      //console.log('Expanded');
    }
  }

  openShoppingCart(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.height = '90%';
    dialogConfig.width = '90%';
    dialogConfig.data = {origin: this.origin, destination: this.destination};

    let dialogRef = this.dialog.open(ShoppingcartComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  addFlightToCart(row) {
    //alert(row['flight_no']);
    if(!this.selection.isSelected(row)){
      this.cartService.addToCart(row);
    }else{
      this.cartService.removeFromCart(row);
    }
   }

  isEmpty(){
    //console.log(this.datalength);
    if(this.datalength === 0){
      return true;
    }
    return false;
  }

  goBack(): void {
    this.location.back();
  }

}
export class FlightDataSource extends DataSource<Flight> {
  constructor(private data: Flight[]) { 
    super()

  }
  connect(): Observable<Flight[]> {
    return Observable.of(this.data);
      //.do(data => this.empty = !data.length);
  }
  disconnect() {
  }
}