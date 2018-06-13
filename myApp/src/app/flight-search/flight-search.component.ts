import { Component, OnInit , ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { startWith, map} from 'rxjs/operators';
import { MatDatepicker, TooltipPosition } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';
export interface CityGroup {
  letter: string;
  names: string[];
}
@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  DATE_DATA_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  flightsearchForm: FormGroup;
  cityForm: FormGroup = this.formBuilder.group({
    cityGroup: '',
  });
  panelOpenState: boolean = false;
  @ViewChild( MatDatepicker) picker: MatDatepicker<Moment>;
  isValidMoment: boolean = false;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  checked = false;
  message = '';

  typeofTravel = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  cityGroups: CityGroup[] = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['DFW']
  }, {
    letter: 'F',
    names: ['Florida']
  }, {
    letter: 'G',
    names: ['Georgia']
  }, {
    letter: 'H',
    names: ['Hawaii']
  }, {
    letter: 'I',
    names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  }, {
    letter: 'K',
    names: ['Kansas', 'Kentucky']
  }, {
    letter: 'L',
    names: ['Louisiana']
  }, {
    letter: 'M',
    names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  }, {
    letter: 'N',
    names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  }, {
    letter: 'O',
    names: ['Ohio', 'Oklahoma', 'Oregon']
  }, {
    letter: 'P',
    names: ['PHX']
  }, {
    letter: 'R',
    names: ['Rhode Island']
  }, {
    letter: 'S',
    names: ['South Carolina', 'South Dakota']
  }, {
    letter: 'T',
    names: ['Tennessee', 'Texas']
  }, {
    letter: 'U',
    names: ['Utah']
  }, {
    letter: 'V',
    names: ['Vermont', 'Virginia']
  }, {
    letter: 'W',
    names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  }];

  cityGroupOptions: Observable<CityGroup[]>;

  times = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.flightsearchForm = this.formBuilder.group({
      'typeoftravel' : ['', Validators.required],
      'fromcity' : [null, Validators.required],
      'tocity' : [null, Validators.required],
      'connection_city' : [null, Validators.nullValidator],
      'depart_date' : [null, Validators.required],
      'depart_time' : [null, Validators.required],
      'return_date' : [null, Validators.nullValidator],
      'return_time' : [null, Validators.nullValidator]
    });
    this.cityGroupOptions = this.cityForm.get('cityGroup')!.valueChanges
    .pipe(
      startWith(''),
      map(val => this.filterGroup(val))
    );
  }

  ngAfterViewInit(){
    this.picker._selectedChanged.subscribe(
      (newDate: Moment) => {
        this.isValidMoment = moment.isMoment(newDate);
      },
      (error) => {
        throw Error(error);
      }
    );
  }
  flightsearch(form:NgForm){
    let departDateTime = moment(this.flightsearchForm.controls.depart_date.value).add(this.flightsearchForm.controls.depart_time.value, 'hours').format(this.DATE_DATA_FORMAT)

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.flightsearchForm.controls.fromcity.value,
        tocity: this.flightsearchForm.controls.tocity.value,
        //departDateTime: departDateTime
      }
    });
    this.router.navigate(['flight-search-results'],{ queryParams: { fromcity: this.flightsearchForm.controls.fromcity.value, 'tocity': this.flightsearchForm.controls.tocity.value } });
  }
  /*flightsearch(form:NgForm){

    let departDateTime = moment(this.flightsearchForm.controls.depart_date.value).add(this.flightsearchForm.controls.depart_time.value, 'hours').format(this.DATE_DATA_FORMAT)

    const Params = new HttpParams({
      fromObject: {
        fromcity: this.flightsearchForm.controls.fromcity.value,
        tocity: this.flightsearchForm.controls.tocity.value,
        //departDateTime: departDateTime
      }
    });

    this.http.get('/api/flight-search-results', { params: Params }).subscribe(resp => {
      //console.log(resp);
      this.router.navigate(['flight-search-results']);
    }, err => {
      this.message = err.error.msg;
    });
  }*/
  filterGroup(val: string): CityGroup[] {
    if (val) {
      return this.cityGroups
        .map(group => ({ letter: group.letter, names: this._filter(group.names, val) }))
        .filter(group => group.names.length > 0);
    }
    return this.cityGroups;
  }
  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
