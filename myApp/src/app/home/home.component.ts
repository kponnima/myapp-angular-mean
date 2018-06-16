import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../common-services/message.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../common-services/auth.service';
export interface UserProfile {
  _id: Number;
  username: string;
  email:string;
  phone:Number;
  date_created:Date;
  role_id: Number;
  privilege_id:Number;
  status_id:Number
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy  {
  loggedInSub: Subscription;
  public cols: Observable<number>;
  adminBoolean: boolean = false;
  sub: any;
  userProfile: UserProfile[] = [];
  id: Number;
  username: string;
  email: string;
  phone: Number;
  date_created: Date;
  role_id: Number;
  privilege_id: Number;
  status_id: Number;


  constructor(private observableMedia: ObservableMedia, private auth: AuthService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private service:MessageService, private snackBar: MatSnackBar) {
    }

  ngOnInit() {
    this.loggedInSub = this.auth.isLoggedIn.subscribe(
      loggedIn => loggedIn ? true : null
    )
    //this.findActiveUser();
    this.getActiveUserProfile();
    this.isAdmin(this.role_id);

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
      .map(change => {
        console.log(change);
        console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      })
      .startWith(start);
  }
  ngOnDestroy() {
    this.loggedInSub.unsubscribe();
  }
  findActiveUser(){
    this.http.get<UserProfile>('/api/activeuser/:1')
      .subscribe(data => {
        console.log(data);
        console.log("User role ID : " + data.role_id);
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
  getActiveUserProfile(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser){
      this.id = currentUser._id;
      this.username = currentUser.username;
      this.email = currentUser.email;
      this.phone = currentUser.phone;
      this.date_created = currentUser.date_created;
      this.role_id = currentUser.role_id;
      this.privilege_id = currentUser.privilege_id;
      this.status_id = currentUser.status_id;
    }
  }
  isAdmin(roleid){
    if(roleid === 1){
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
