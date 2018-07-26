import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, filter } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUserSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private loggedInUser: User[] = [];

  private Admin = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loggedInUserSubject.subscribe(_ => this.loggedInUser = _);
  }

  private baseUrl: string = 'api/user';  // web api end point
  private usersFetchUrl: string = 'api/users';  // web api end point
  private userCreateUrl: string = 'api/user-create';  // web api end point
  private userDetailUrl: string = 'api/user-detail';  // web api end point
  private userEditUrl: string = 'api/user-edit';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  //private delayMs = 10000;
  private delayMs = environment.delayMs;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersFetchUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;;
  }

  get isAdmin() {
    var value = JSON.parse(localStorage.getItem('isAdminUser'));
    //console.log('Admin value : ' + value);
    if(value){
      this.Admin.next(true);
    }else{
      this.Admin.next(false);
    }
    return this.Admin.asObservable();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id)
    .pipe(delay(this.delayMs));
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + username)
    .pipe(delay(this.delayMs));
  }

  getUserDetailByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.userDetailUrl + '/' + username)
    .pipe(delay(this.delayMs));
  }

  createUser(user: User) {
    return this.http.post(this.userCreateUrl, user)
    .pipe(delay(this.delayMs));
  }

  updateUser(user: User) {
    return this.http.put(this.userEditUrl + '/' + user.username, user)
    .pipe(delay(this.delayMs));
  }

  deleteUser(username: string) {
    return this.http.delete(this.baseUrl + '/' + username)
    .pipe(delay(this.delayMs));
  }

  public addLoggedInUser(user: User) {
    this.loggedInUserSubject.next([...this.loggedInUser, user]);
  }

  public getLoggedInUsers(): Observable<User[]> {
    return this.loggedInUserSubject;
  }

  public removeLoggedInUser(user: User) {
    const currentItems = [...this.loggedInUser];
    const itemsWithoutRemoved = currentItems.filter(_ => _._id !== user._id);
    this.loggedInUserSubject.next(itemsWithoutRemoved);
  }

  private _checkAdmin(user: User) {
    // Check if the user has admin role
    if(user.role_id === 1) {
      this.Admin.next(true);
      localStorage.setItem('isAdminUser', 'true');
    }else{
      this.Admin.next(false);
      localStorage.setItem('isAdminUser', 'false');
    }
  }
}
