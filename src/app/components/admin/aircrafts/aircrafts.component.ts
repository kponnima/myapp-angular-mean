import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

import { Aircraft } from 'src/app/models/aircraft';

import { AircraftService } from 'src/app/services/aircraft.service';
import { MessageService } from 'src/app/helpers/message.service';

@Component({
  selector: 'app-aircrafts',
  templateUrl: './aircrafts.component.html'
})
export class AircraftsComponent implements OnInit {
  loading: boolean = true;
  @Input() aircraft: Aircraft;
  aircrafts: any;
  displayedColumns = ['aircraft_no', 'aircraft_id', 'aircraftname', 'carrier', 'inventory_id', 'equipment_id'];
  dataSource: AircraftDataSource;

  constructor(private aircraftService: AircraftService, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private location: Location, private service: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllAircrafts();
  }

  getAllAircrafts() {
    this.loading = true;
    this.aircraftService.getAircrafts()
      .subscribe(data => {
        //console.log(data);
        this.aircrafts = data;
        this.dataSource = new AircraftDataSource(this.aircrafts);
        this.loading = false;
      });
  }

  deleteFlight(aircraft_no: number) {
    this.aircraftService.deleteAircraft(aircraft_no)
      .subscribe(res => {
        this.router.navigate(['/aircrafts']);
      }, (err) => {
        console.log(err);
      }
      );
  }

  goBack(): void {
    this.location.back();
  }

  sendMessage(message: string): void {
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
export class AircraftDataSource extends DataSource<Aircraft> {
  constructor(private data: Aircraft[]) {
    super()

  }
  connect(): Observable<Aircraft[]> {
    return of(this.data);
  }
  disconnect() {
  }
}
