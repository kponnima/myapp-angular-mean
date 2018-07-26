import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTripOptionsComponent } from './flight-trip-options.component';

describe('FlightTripOptionsComponent', () => {
  let component: FlightTripOptionsComponent;
  let fixture: ComponentFixture<FlightTripOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTripOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTripOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
