import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  @Input() user: User;
  users: any;
  displayedColumns = ['index','username', 'email', 'phone', 'date_created', 'role_id', 'privilege_id', 'status_id'];
  dataSource: UserDataSource;

  constructor(private userService: UserService, private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers()
      .subscribe(data => {
        //console.log(data);
        this.users = data;
        this.dataSource = new UserDataSource(this.users);
      });
  }

  deleteUser(username: string) {
    this.userService.deleteUser(username)
      .subscribe(res => {
        this.router.navigate(['/users']);
      }, (err) => {
        console.log(err);
      }
      );
  }

  goBack(): void {
    this.location.back();
  }
}
export class UserDataSource extends DataSource<User> {
  constructor(private data: User[]) {
    super()

  }
  connect(): Observable<User[]> {
    return of(this.data);
  }
  disconnect() {
  }
}

