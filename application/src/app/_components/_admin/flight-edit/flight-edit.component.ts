import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Flight } from '../../../_models/flight';

import { FlightService } from '../../../_services/flight.service';
import { MessageService } from '../../../_helpers/message.service';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnInit {
  private loading: boolean = true;
  flightEditForm: FormGroup;
  flightno: number;

  flight_no: number;
  origin: string = '';
  destination: string = '';
  depart_date: string = '';
  arrival_date: string = '';
  aircraft_id: string = '';
  price: number;
  carrier: string = '';
  duration: number;
  miles: number;
  inventory_id: number;
  equipment_id: number;

  constructor(private flightService: FlightService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.flightno = this.route.snapshot.params['flight_no'];

    this.flightEditForm = this.formBuilder.group({
      'flight_no': [null, Validators.compose([Validators.minLength(1), Validators.required])],
      'origin': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      'destination': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      'depart_date': [null, Validators.required],
      'depart_time': [null, Validators.required],
      'arrival_date': [null , Validators.required],
      'arrival_time': [null, Validators.required],
      'aircraft_id': [null, Validators.required],
      'price': [null, Validators.required],
      'carrier': [null, Validators.required],
      'duration': [null, Validators.nullValidator],
      'miles': [null, Validators.nullValidator],
      'inventory_id': [null, Validators.required],
      'equipment_id': [null, Validators.required]
    });

    this.getFlight(this.flightno);
  }

  getFlight(flightno) {
    this.flightService.getFlightById(flightno).subscribe(data => {
      //console.log(data);
      this.flightEditForm.setValue({
        flight_no: data["0"].flight_no,
        origin: data["0"].origin,
        destination: data["0"].destination,
        depart_date: data["0"].departuredatetime,
        depart_time: data["0"].departuredatetime,
        arrival_date: data["0"].arrivaldatetime,
        arrival_time: data["0"].arrivaldatetime,
        aircraft_id: data["0"].aircraft_id,
        price: data["0"].price,
        carrier: data["0"].carrier,
        duration: data["0"].duration,
        miles: data["0"].miles,
        inventory_id: data["0"].inventory_id,
        equipment_id: data["0"].equipment_id,
      });
    });
  }

  onFormSubmit(form: NgForm) {
    this.flightService.updateFlight(this.flightEditForm.value)
      //this.http.put('/api/flight-edit', form)
      .subscribe(res => {
        const upadtedflight_no = res['flight_no'];
        this.sendMessage('Flight no [ ' + upadtedflight_no + ' ] updated successfully! ');
        this.router.navigate(['/flight-detail', upadtedflight_no]);
      }, (err) => {
        console.log(err);
      }
      );
  }

  flightDetails() {
    this.router.navigate(['/flight-detail', this.flightno]);
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
