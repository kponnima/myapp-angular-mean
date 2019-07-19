import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, takeWhile, shareReplay, startWith, finalize } from 'rxjs/operators';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Airport } from '../../../_models/airport';
import { User } from '../../../_models/user';

import { MessageService } from '../../../_helpers/message.service';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  private isLoading: boolean = false;
  //private formSubmitAttempt: boolean = false;
  DATE_DATA_FORMAT = 'YYYY-mm-ddTHH:mm:ssZ';

  userCreateForm: FormGroup;
  data: any;
  isValidMoment: boolean = false;
  prepared: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  hide = true;
  message = '';

  roles = [
    1, 2, 3
  ];

  privileges = [
    1, 2, 3
  ];

  statuses = [
    1, 2, 3
  ];

  constructor(private userService: UserService, private http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userCreateForm = this.formBuilder.group({
      'username' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )],
      'password' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )],
      'email' : [null, Validators.compose( [ Validators.email, Validators.required ] )],
      'phone' : [null, Validators.compose( [ Validators.minLength(10), Validators.required ] )],
      'date_created' : [new Date(), Validators.nullValidator],
      'role_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )],
      'privilege_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )],
      'status_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )]
    });
  }

  ngOnChanges() {
    this.resetForm();
  }

  userCreate() {
    this.prepared = this.preuserCreate();
    //this.resetForm();
    if(this.prepared){
      this.userService.createUser(this.userCreateForm.value).subscribe(resp => {
      //this.http.post('/api/user-create', this.userCreateForm.value).subscribe(resp => {
        this.data = resp;
        //console.log(this.data);
        if(!(this.data.success)){
          this.sendMessage(this.data.msg);
        }else{
          this.sendMessage(this.data.msg);
          this.router.navigate(['users']);
        }
      }, err => {
        console.log(err);
        this.sendMessage(err);
        this.message = err.error.msg;
      });
    }
  }

  resetForm() {
    //console.log('I am invoked');
    this.userCreateForm.reset;
    this.userCreateForm.markAsPristine();
    this.userCreateForm.markAsUntouched();
    this.userCreateForm.updateValueAndValidity();
    this.userCreateForm.clearValidators();
  }

  preuserCreate() {

    let created_date = moment(this.userCreateForm.controls.date_created.value)
    .toISOString();

    this.userCreateForm.patchValue({
      date_created: created_date,
    });

    return moment(created_date).isValid();
    //return true;
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

  private handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      console.log("Client-side error occured.");
      console.log(err);
    } else {
      console.log("Server-side error occured.");
      console.log(err);
    }
    this.sendMessage(err);
    return Observable.throw(err.message)
  }

}

