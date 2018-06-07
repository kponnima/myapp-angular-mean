import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTripConfirmationComponent } from './flight-trip-confirmation.component';

describe('FlightTripConfirmationComponent', () => {
  let component: FlightTripConfirmationComponent;
  let fixture: ComponentFixture<FlightTripConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTripConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTripConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
