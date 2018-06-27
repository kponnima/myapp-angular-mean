import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  flight = {};

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.getFlightDetails(this.route.snapshot.params['id']);
  }

  getFlightDetails(id) {
    this.http.get(id)
      .subscribe(data => {
        console.log(data);
        this.flight = data;
      });
  }
  deleteFlight(id) {
    this.http.delete(id)
      .subscribe(res => {
          this.router.navigate(['/flights']);
        }, (err) => {
          console.log(err);
        }
      );
  }
}
