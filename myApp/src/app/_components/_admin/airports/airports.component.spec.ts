import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatAutocompleteModule, MatCardModule, MatDatepickerModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule, MatSelectModule, MatSnackBar, MatTableModule, MatTooltipModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AirportsComponent } from './airports.component';
import { MessageService } from '../../../_helpers/message.service';

describe('AirportsComponent', () => {
  let component: AirportsComponent;
  let fixture: ComponentFixture<AirportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportsComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        OverlayModule
      ],
      providers: [MessageService, MatSnackBar]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
