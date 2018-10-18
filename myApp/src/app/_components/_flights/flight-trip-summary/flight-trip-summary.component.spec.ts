import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule, MatBadgeModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule, MatSelectModule, MatSnackBar, MatStepperModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { FlightTripSummaryComponent } from './flight-trip-summary.component';
import { MessageService } from '../../../_helpers/message.service';
import { AuthService } from '../../../_helpers/auth.service';

describe('FlightTripSummaryComponent', () => {
  let component: FlightTripSummaryComponent;
  let fixture: ComponentFixture<FlightTripSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTripSummaryComponent ],
      imports: [
        FormsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatCardModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [AuthService, MessageService, MatSnackBar]
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
