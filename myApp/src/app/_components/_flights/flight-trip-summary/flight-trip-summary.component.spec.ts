import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTripSummaryComponent } from './flight-trip-summary.component';

describe('FlightTripSummaryComponent', () => {
  let component: FlightTripSummaryComponent;
  let fixture: ComponentFixture<FlightTripSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTripSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
