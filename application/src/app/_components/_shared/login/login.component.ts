import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../../../_models/user';

import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  username: String = '';
  password: String = '';
  // loginData = { username:'', password:'' };
  message = '';
  data: any;
  hide = true;
  
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, 
    private authService: AuthService, private service:MessageService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      'username' : [null, Validators.required],
      'password' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )]
    });
  }
  login(form: NgForm) {
    this.http.post('/api/signin',form)
    .subscribe(resp => {
      this.data = resp;
      localStorage.setItem('jwtToken', this.data.token);
      //localStorage.setItem('currentUser', JSON.stringify(this.data.profile));
      //this.authService.addLoggedInUser(this.data.profile);
      this.authService.login(this.signinForm.value);
     //this.router.navigate(['home'], { queryParams: { id: this.username } }); 
     //this.router.navigate(['home'], { queryParams: { id: this.username } });
    }, err => {
      // this.message = err.error.msg;
      this.sendMessage(err.error.msg);
    });
  }
  sendMessage(message: string): void {
    // send message to subscribers via observable subject
    //this.service.sendMessage(message);
    this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
  }

  clearMessage():void{
    this.service.clearMessage();
  }
}
