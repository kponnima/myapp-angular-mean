import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  flights: any;
  displayedColumns = ['isbn', 'title', 'author'];
  //dataSource = new FlightDataSource(this.api);

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/flight', httpOptions).subscribe(data => {
      this.flights = data;
      console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }
  
  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
}

/*export class FlightDataSource extends DataSource<any> {
  constructor(private http: HttpClient, private router: Router) { 
    super()
  }

  connect() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/flights', httpOptions).subscribe(data => {
      this.flight = data;
      console.log(this.flights);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
    return this.api.getBooks();
  }

  disconnect() {

  }
}*/
