import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatToolbarModule,
  MatDividerModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule } from "@angular/material";

import { AppComponent } from './app.component';
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
  declarations: [
    AppComponent,
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
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatDividerModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
