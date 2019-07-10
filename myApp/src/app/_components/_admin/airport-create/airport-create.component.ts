import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith, finalize } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Airport } from '../../../_models/airport';

import { MessageService } from '../../../_helpers/message.service';
import { AirportService } from '../../../_services/airport.service';

@Component({
  selector: 'app-airport-create',
  templateUrl: './airport-create.component.html',
  styleUrls: ['./airport-create.component.css']
})
export class AirportCreateComponent implements OnInit {
  private loading: boolean = false;
  //private formSubmitAttempt: boolean = false;

  airportCreateForm: FormGroup;
  data: any;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  message = '';

  constructor(private airportService: AirportService, private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.airportCreateForm = this.formBuilder.group({
      'airportcode' : [null, Validators.compose( [ Validators.minLength(3), Validators.maxLength(3), Validators.required ] )],
      'airportname' : [null, Validators.required ],
      'cityname' : [null, Validators.required],
      'countrycode' : [null, Validators.required ],
      'countryname' : [null, Validators.required]
    });
  }

  ngOnChanges() {
    this.resetForm();
  }

  airportCreate() {
    //this.resetForm();
      this.loading = true;
      this.airportService.createAirport(this.airportCreateForm.value)
      .subscribe(resp => {
      //this.http.post('/api/airport-create', this.airportCreateForm.value).subscribe(resp => {
        this.data = resp;
        //console.log(this.data);
        if(!(this.data.success)){
          this.loading = false;
          this.sendMessage(this.data.msg);
        }else{
          this.loading = false;
          this.sendMessage(this.data.msg);
          this.router.navigate(['airports']);
        }
      }, err => {
        console.log(err);
        this.loading = false;
        this.sendMessage(err);
        this.message = err.error.msg;
      });
  }

  resetForm() {
    //console.log('I am invoked');
    this.airportCreateForm.reset;
    this.airportCreateForm.markAsPristine();
    this.airportCreateForm.markAsUntouched();
    this.airportCreateForm.updateValueAndValidity();
    this.airportCreateForm.clearValidators();
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
