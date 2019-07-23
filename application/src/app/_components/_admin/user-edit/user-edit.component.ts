import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { User } from '../../../_models/user';

import { UserService } from '../../../_services/user.service';
import { MessageService } from '../../../_helpers/message.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userEditForm: FormGroup;
  hide = true;

  user_name: string = '';
  
  username: string = '';
  password: string = '';
  email: string = '';
  phone: string = '';
  date_created: string = '';
  role_id: number;
  privilege_id: number;
  status_id: number;

  roles = [
    1, 2, 3
  ];

  privileges = [
    1, 2, 3
  ];

  statuses = [
    1, 2, 3
  ];


  constructor(private userService: UserService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user_name = this.route.snapshot.params['username'];

    this.userEditForm = this.formBuilder.group({
      'username' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )],
      'password' : [null, Validators.compose( [ Validators.minLength(7), Validators.required ] )],
      'email' : [null, Validators.compose( [ Validators.email, Validators.required ] )],
      'phone' : [null, Validators.compose( [ Validators.minLength(10), Validators.required ] )],
      'date_created' : [null, Validators.nullValidator],
      'role_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )],
      'privilege_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )],
      'status_id' : [null, Validators.compose( [ Validators.minLength(1), Validators.required ] )]
    });

    this.getUser(this.user_name);
  }

  getUser(user_name: string) {
    this.userService.getUserDetailByUsername(user_name).subscribe(data => {
      //console.log(data);
      this.userEditForm.setValue({
        username: data["0"].username,
        password: data["0"].password,
        email: data["0"].email,
        phone: data["0"].phone,
        date_created: data["0"].date_created,
        role_id: data["0"].role_id,
        privilege_id: data["0"].privilege_id,
        status_id: data["0"].status_id
      });
    });
  }

  onFormSubmit(form: NgForm) {
    this.userService.updateUser(this.userEditForm.value)
      //this.http.put('/api/user-edit', form)
      .subscribe(res => {
        const upadtedUser_username = res['username'];
        this.sendMessage('User with ID [ ' + upadtedUser_username + ' ] updated successfully! ');
        this.router.navigate(['/user-detail', upadtedUser_username]);
      }, (err) => {
        console.log(err);
      }
      );
  }

  userDetails() {
    this.router.navigate(['/user-detail', this.user_name]);
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