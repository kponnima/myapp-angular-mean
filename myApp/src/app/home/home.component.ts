import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable, BehaviorSubject, Subscription, of, Subject } from 'rxjs';
import { tap, catchError, map, takeWhile, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { User } from '../_models/user';
import { MessageService } from '../_helpers/message.service';
import { AuthService } from '../_helpers/auth.service';
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() user: User;
  loggedInSub: Subscription;
  loggedname: any;
  isAdmin$: Observable<boolean>;
  roleID: Number = 0;

  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];

  constructor(private observableMedia: ObservableMedia, private authService: AuthService, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private userService: UserService,
    private service: MessageService, private snackBar: MatSnackBar) {
    //this.loggedname = this.loggedInUserItems["0"].username;
    //this.loggedInUserItems$.subscribe(_ => _["0"].username ? this.loggedname : null);
    //console.log(this.loggedInUserItems.length);
    //this.loggedInUserItems.map(_ => _ ? this.loggedname : null);
    //console.log(this.loggedname);
    //console.log(this.loggedInUserItems["0"].username);
  }

  ngOnInit() {
    /*this.loggedInSub = this.authService.isLoggedIn.subscribe(
      loggedIn => loggedIn ? true : null
    );*/

    this.loggedInUserItems$ = this.authService.getLoggedInUsers();
    this.loggedInUserItems$.subscribe(_ => {
      this.loggedInUserItems = _;
      this.loggedname = (this.loggedInUserItems["0"].username !== undefined) ? localStorage.getItem('username') : null;
    });

    this.getUserProfile();

    this.isAdmin$ = this.userService.isAdmin;
  }

  getUserProfile() {
    if (localStorage.getItem('username') !== null || localStorage.getItem('username') !== undefined) {
      if (this.loggedname === undefined) {
        this.loggedname = localStorage.getItem('username');
      }
      this.userService.getUserByUsername(this.loggedname)
        .subscribe(data => {
          //console.log(data);
          //console.log("User role ID : " + data["0"].role_id);
          this.roleID = data["0"].role_id;
          //if user is ADMIN set the admin flag
          if (this.roleID === 1) {
            localStorage.setItem('isAdminUser', 'true');
            this.isAdmin$ = this.userService.isAdmin;
          } else {
            localStorage.setItem('isAdminUser', 'false');
          }
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
            console.log(err);
          } else {
            console.log("Server-side error occured.");
            console.log(err);
          }
          this.sendMessage(err);
        }
        );
    }
  }

  adminView() {
    this.router.navigate(['admin']);
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
