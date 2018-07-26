import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  username: String = '';
  password: String = '';
  email: String = '';
  phone: Number = null;
  date_created: Date = new Date();
  role_id: Number = Number(2);
  privilege_id: Number = Number(1);
  status_id: Number = Number(1);
  message = '';

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      'username' : [null, Validators.required],
      'password' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )],
      'email' : [null, Validators.compose( [ Validators.email, Validators.required ] )],
      'phone' : [null, Validators.compose( [ Validators.minLength(9), Validators.required ] )],
      'date_created' : [new Date(), Validators.nullValidator],
      'role_id' : [Number(2), Validators.nullValidator],
      'privilege_id' : [Number(1), Validators.nullValidator],
      'status_id' : [Number(1), Validators.nullValidator]
    });
  }

  signup(form: NgForm) {
    this.http.post('/api/signup', form).subscribe(resp => {
      console.log(resp);
      /*if([resp[0].success === 'false'){
        this.message = String([resp[0].msg);
      }else{
        //form.resetForm();
        this.router.navigate(['login']);
      }*/
      
      // form.resetForm();
      this.router.navigate(['login']);
    }, err => {
      this.message = err.error.msg;
    });
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
