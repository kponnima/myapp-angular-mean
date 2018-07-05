import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUserSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private loggedInUser: User[] = [];

  constructor(private http: HttpClient) {
    this.loggedInUserSubject.subscribe(_ => this.loggedInUser = _);
  }

  private baseUrl: string = 'api/user';  // web api end point
  //baseUrl: string = 'http://localhost:4200/api';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  getUserByUsername(username: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + username);
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
}
