import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/shared/login/login.component';
import { SignupComponent } from './components/shared/signup/signup.component';
import { HomeComponent } from './components/shared/home/home.component';

import { FlightsComponent } from './components/admin/flights/flights.component';
import { FlightDetailComponent } from './components/admin/flight-detail/flight-detail.component';
import { FlightCreateComponent } from './components/admin/flight-create/flight-create.component';
import { FlightEditComponent } from './components/admin/flight-edit/flight-edit.component';
import { FlightSearchComponent } from './components/flights/flight-search/flight-search.component';
import { FlightSearchResultsComponent } from './components/flights/flight-search-results/flight-search-results.component';
import { FlightTripOptionsComponent } from './components/flights/flight-trip-options/flight-trip-options.component';
import { FlightTripSummaryComponent } from './components/flights/flight-trip-summary/flight-trip-summary.component';
import { FlightTripConfirmationComponent } from './components/flights/flight-trip-confirmation/flight-trip-confirmation.component';
import { TripsComponent } from './components/flights/trips/trips.component';

import { AdminComponent } from './components/admin/admin/admin.component';
import { UsersComponent } from './components/admin/users/users.component';
import { UserCreateComponent } from './components/admin/user-create/user-create.component';
import { UserEditComponent } from './components/admin/user-edit/user-edit.component';
import { UserDetailComponent } from './components/admin/user-detail/user-detail.component';
import { AirportsComponent } from './components/admin/airports/airports.component';
import { AirportCreateComponent } from './components/admin/airport-create/airport-create.component';
import { AirportEditComponent } from './components/admin/airport-edit/airport-edit.component';
import { AirportDetailComponent } from './components/admin/airport-detail/airport-detail.component';
import { AircraftsComponent } from './components/admin/aircrafts/aircrafts.component';
import { AircraftCreateComponent } from './components/admin/aircraft-create/aircraft-create.component';
import { AircraftEditComponent } from './components/admin/aircraft-edit/aircraft-edit.component';
import { AircraftDetailComponent } from './components/admin/aircraft-detail/aircraft-detail.component';
import { InventoryComponent } from './components/admin/inventory/inventory.component';
import { InventoryCreateComponent } from './components/admin/inventory-create/inventory-create.component';
import { InventoryEditComponent } from './components/admin/inventory-edit/inventory-edit.component';
import { InventoryDetailComponent } from './components/admin/inventory-detail/inventory-detail.component';
import { ProfileComponent } from './components/shared/profile/profile.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Register'}
  },
  /*{
    path: 'home', canActivate: [AuthGuard], component: HomeComponent, data: { title: 'Home' },
    children: [
      { path: 'flight-search', canActivate: [AuthGuard], component: FlightSearchComponent, data: { title: 'Flight Search' } },
      { path: 'flight-search-results', canActivate: [AuthGuard], component: FlightSearchResultsComponent, data: { title: 'Flight Search Results' } },
      { path: 'flight-trip-options', canActivate: [AuthGuard], component: FlightTripOptionsComponent, data: { title: 'Flight Trip Options' } },
    ]
  },*/
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: { title: 'AdminView' }
  },
  {
    path: 'user/:username',
    component: ProfileComponent,
    data: { title: 'User Profile' }
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
    path: 'trips',
    component: TripsComponent,
    data: { title: 'Saved Trips' }
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'Users List' }
  },
  {
    path: 'user-create',
    component: UserCreateComponent,
    data: { title: 'Create User' }
  },
  {
    path: 'user-edit/:username',
    component: UserEditComponent,
    data: { title: 'Edit User' }
  },
  {
    path: 'user-detail/:username',
    component: UserDetailComponent,
    data: { title: 'User Details' }
  },
  {
    path: 'flights',
    component: FlightsComponent,
    data: { title: 'Flights List' }
  },
  {
    path: 'flight-create',
    component: FlightCreateComponent,
    data: { title: 'Create Flight' }
  },
  {
    path: 'flight-edit/:flight_no',
    component: FlightEditComponent,
    data: { title: 'Edit Flight' }
  },
  {
    path: 'flight-detail/:flight_no',
    component: FlightDetailComponent,
    data: { title: 'Flight Details' }
  },
  {
    path: 'airports',
    component: AirportsComponent,
    data: { title: 'Airports List' }
  },
  {
    path: 'airport-create',
    component: AirportCreateComponent,
    data: { title: 'Create Airport' }
  },
  {
    path: 'airport-edit/:airportcode',
    component: AirportEditComponent,
    data: { title: 'Edit Airport' }
  },
  {
    path: 'airport-detail/:airportcode',
    component: AirportDetailComponent,
    data: { title: 'Airport Details' }
  },
  {
    path: 'aircrafts',
    component: AircraftsComponent,
    data: { title: 'Aircrafts List' }
  },
  {
    path: 'aircraft-create',
    component: AircraftCreateComponent,
    data: { title: 'Create Aircraft' }
  },
  {
    path: 'aircraft-edit/:aircraft_no',
    component: AircraftEditComponent,
    data: { title: 'Edit Aircraft' }
  },
  {
    path: 'aircraft-detail/:aircraft_no',
    component: AircraftDetailComponent,
    data: { title: 'Aircraft Details' }
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    data: { title: 'Inventory List' }
  },
  {
    path: 'inventory-create',
    component: InventoryCreateComponent,
    data: { title: 'Create Inventory' }
  },
  {
    path: 'inventory-edit/:id',
    component: InventoryEditComponent,
    data: { title: 'Edit Inventory' }
  },
  {
    path: 'inventory-detail/:id',
    component: InventoryDetailComponent,
    data: { title: 'Inventory Details' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes
    //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
