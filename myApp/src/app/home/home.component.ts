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
  adminBoolean: boolean = false;
  loggedname: any;
  roleID:Number = 0;

  public cols: Observable<number>;
  
  public loggedInUserItems$: Observable<User[]> = of([]);
  public loggedInUserItems: User[] = [];

  constructor(private observableMedia: ObservableMedia, private authService: AuthService, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private userService: UserService,
    private service:MessageService, private snackBar: MatSnackBar) {
      this.loggedInUserItems$ = this.authService.getLoggedInUsers();
      this.loggedInUserItems$.subscribe(_ => {
        this.loggedInUserItems = _;
        this.loggedname = this.loggedInUserItems["0"].username;
      });
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

    this.getUserProfile();

    const grid = new Map([
      ['xs', 1],
      ['sm', 2],
      ['md', 2],
      ['lg', 3],
      ['xl', 3]
    ]);
    let start: number;
    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });
    this.cols = this.observableMedia.asObservable()
      .pipe(
        map(change => {
        //console.log(change);
        //console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      }),
        startWith(start));
  }

  getUserProfile(){
    if(this.loggedname !== undefined){
        this.userService.getUserByUsername(this.loggedname)
        .subscribe(data => {
          this.roleID = data.role_id;
          this.isAdmin();
          //console.log(data);
          //console.log("User role ID : " + data.role_id);
          },(err: HttpErrorResponse) => {
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

  getActiveUserProfile(){
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /*if (currentUser){
      this.id = currentUser._id;
      this.username = currentUser.username;
      this.email = currentUser.email;
      this.phone = currentUser.phone;
      this.date_created = currentUser.date_created;
      this.role_id = currentUser.role_id;
      this.privilege_id = currentUser.privilege_id;
      this.status_id = currentUser.status_id;
    }*/
  }

  isAdmin(){
    if(this.roleID === 1){
      this.adminBoolean = true;
    }
  }

  sendMessage(message): void {
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
