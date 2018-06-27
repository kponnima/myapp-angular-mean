import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { Flight } from '../_models/flight';
import { CartService } from '../_services/cart.service';
@Component({
  selector: 'app-flight-trip-options',
  templateUrl: './flight-trip-options.component.html',
  styleUrls: ['./flight-trip-options.component.css']
})
export class FlightTripOptionsComponent implements OnInit {
  @Input() flight: Flight;
  origin: any;
  destination: any;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  public shoppingCartItems$: Observable<Flight[]> = of([]);
  public shoppingCartItems: Flight[] = [];
  dataSource = this.shoppingCartItems$;
  displayedColumns = ['flight_no', 'origin', 'destination', 'departure', 'arrival', 'aircraft_id'];
  count:number = 0;

  constructor(private _formBuilder: FormBuilder, private cartService: CartService,
    private router: Router, private route: ActivatedRoute,) {
      this.shoppingCartItems$ = this.cartService.getItems();
      this.shoppingCartItems$.subscribe(_ => this.shoppingCartItems = _);
      this.count = this.cartService.getItemsCount(); 
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.origin = params['fromcity'];
      this.destination = params['tocity'];
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.dataSource = this.cartService.getItems();

    console.log('Selected flights count : ' + this.count);
  }

  confirmFlight(){
    this.router.navigate(['flight-trip-summary']);
  }
}
