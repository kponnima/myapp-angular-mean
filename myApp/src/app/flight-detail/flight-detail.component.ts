import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit {
  flight = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getFlightDetails(this.route.snapshot.params['_id']);
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

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
}
