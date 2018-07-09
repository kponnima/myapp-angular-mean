import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, filter } from 'rxjs/operators';

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
  //baseUrl: string = 'http://localhost:4200/api';

  private delayMs = 500;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl)
    .pipe(delay(this.delayMs)); // simulate latency with delay;;
  }

  get isAdmin() {
    var value = JSON.parse(localStorage.getItem('isAdminUser'));
    console.log('Admin value : ' + value);
    if(value){
      this.Admin.next(true);
    }else{
      this.Admin.next(false);
    }
    return this.Admin.asObservable();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  getUserByUsername(username: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + username)    
  }

  createUser(user: User) {
    return this.http.post(this.baseUrl, user);
  }

  updateUser(user: User) {
    return this.http.put(this.baseUrl + '/' + user._id, user);
  }

  deleteUser(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
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
