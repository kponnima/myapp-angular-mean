import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Airport } from '../../../_models/airport';

import { AirportService } from '../../../_services/airport.service';
import { MessageService } from '../../../_helpers/message.service';
@Component({
  selector: 'app-airport-edit',
  templateUrl: './airport-edit.component.html',
  styleUrls: ['./airport-edit.component.css']
})
export class AirportEditComponent implements OnInit {
  private loading: boolean = true;
  airportEditForm: FormGroup;
  airport_code: string = '';

  airportcode: string = '';
  airportname: string = '';
  cityname: string = '';
  countrycode: string = '';
  countryname: string = '';

  constructor(private airportService: AirportService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.airport_code = this.route.snapshot.params['airportcode'];

    this.airportEditForm = this.formBuilder.group({
      'airportcode': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      'airportname': [null, Validators.compose([Validators.minLength(1), Validators.required])],
      'cityname': [null, Validators.nullValidator],
      'countrycode': [null, Validators.required],
      'countryname': [null, Validators.nullValidator]
    });

    this.getAirport(this.airport_code);
  }

  getAirport(airport_code: string) {
    this.loading = true;
    this.airportService.getAirportByCode(airport_code).subscribe(data => {
      //console.log(data);
      this.airportEditForm.setValue({
        airportcode: data["0"].airportcode,
        airportname: data["0"].airportname,
        cityname: data["0"].cityname,
        countrycode: data["0"].countrycode,
        countryname: data["0"].countryname
      });
      this.loading = false;
    });
  }

  onFormSubmit(form: NgForm) {
    this.loading = true;
    this.airportService.updateAirport(this.airportEditForm.value)
      //this.http.put('/api/airport-edit', form)
      .subscribe(res => {
        const upadtedairport_no = res['airport_no'];
        this.loading = false;
        this.sendMessage('Airport no [ ' + upadtedairport_no + ' ] updated successfully! ');
        this.router.navigate(['/airport-detail', upadtedairport_no]);
      }, (err) => {
        console.log(err);
      }
      );
  }

  airportDetails() {
    this.loading = false;
    this.router.navigate(['/airport-detail', this.airport_code]);
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

