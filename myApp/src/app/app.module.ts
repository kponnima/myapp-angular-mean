import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
 } from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FlightComponent } from './flight/flight.component';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { FlightCreateComponent } from './flight-create/flight-create.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearchResultsComponent } from './flight-search-results/flight-search-results.component';
import { FlightTripOptionsComponent } from './flight-trip-options/flight-trip-options.component';
import { FlightTripSummaryComponent } from './flight-trip-summary/flight-trip-summary.component';
import { FlightTripConfirmationComponent } from './flight-trip-confirmation/flight-trip-confirmation.component';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' }
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'flight-search',
    component: FlightSearchComponent,
    data: { title: 'Flight Search' }
  },
  {
    path: 'flight-search-results',
    component: FlightSearchResultsComponent,
    data: { title: 'Flight Search Results' }
  },
  {
    path: 'flight-trip-options',
    component: FlightTripOptionsComponent,
    data: { title: 'Flight Trip Options' }
  },
  {
    path: 'flight-trip-summary',
    component: FlightTripSummaryComponent,
    data: { title: 'Flight Trip Summary' }
  },
  {
    path: 'flight-trip-confirmation',
    component: FlightTripConfirmationComponent,
    data: { title: 'Flight Trip Confirmation' }
  },
  {
    path: 'flights',
    component: FlightComponent,
    data: { title: 'Flights List' }
  },
  {
    path: 'flight-details/:id',
    component: FlightDetailComponent,
    data: { title: 'Flight Details' }
  },
  {
    path: 'flight-create',
    component: FlightCreateComponent,
    data: { title: 'Create Book' }
  },
  {
    path: 'flight-edit/:id',
    component: FlightEditComponent,
    data: { title: 'Edit Flight' }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FlightComponent,
    FlightDetailComponent,
    FlightCreateComponent,
    FlightEditComponent,
    LoginComponent,
    SignupComponent,
    FlightSearchComponent,
    FlightSearchResultsComponent,
    FlightTripOptionsComponent,
    FlightTripSummaryComponent,
    FlightTripConfirmationComponent
  ],
  providers: [
    Title,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }