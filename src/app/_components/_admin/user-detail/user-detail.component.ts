import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';

import { User } from '../../../_models/user';

import { UserService } from '../../../_services/user.service';
import { MessageService } from '../../../_helpers/message.service';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: {
    username: any;
    email: any;
    password: any;
    phone: any;
    date_created: any;
    role_id: any;
    privilege_id: any;
    status_id: any;
  };
  user_name:string;

  constructor(private userService: UserService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUserDetails(this.route.snapshot.params['username']);
  }

  getUserDetails(username: string) {
    this.userService.getUserDetailByUsername(username)
      .subscribe(data => {
        //console.log(data);
        //this.user = data;
        this.user = data["0"];
        this.user_name = data["0"].username;
      });
  }

  deleteUser(username: string) {
    this.userService.deleteUser(username)
      .subscribe(res => {
        this.sendMessage('User [' + username + '] deleted successfully! ');
        this.router.navigate(['/users']);
      }, (err) => {
        console.log(err);
        this.sendMessage('Failed to deleted user with no '+ username);
      });
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

