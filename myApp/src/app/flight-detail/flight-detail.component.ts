import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit {
  flight = {};

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.getFlightDetails(this.route.snapshot.params['id']);
  }

  getFlightDetails(id) {
    this.api.getFlight(id)
      .subscribe(data => {
        console.log(data);
        this.flight = data;
      });
  }

  deleteFlight(id) {
    this.api.deleteFlight(id)
      .subscribe(res => {
          this.router.navigate(['/flights']);
        }, (err) => {
          console.log(err);
        }
      );
  }
}
