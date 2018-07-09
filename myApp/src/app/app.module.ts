import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
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
import { MessageComponent } from './message/message.component';
import { FooterComponent } from './footer/footer.component';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { MessageService } from './_helpers/message.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { FlightsComponent } from './_components/_admin/flights/flights.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { CarSearchComponent } from './car-search/car-search.component';

import { FlightDetailComponent } from './_components/_admin/flight-detail/flight-detail.component';
import { FlightCreateComponent } from './_components/_admin/flight-create/flight-create.component';
import { FlightEditComponent } from './_components/_admin/flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearchResultsComponent } from './flight-search-results/flight-search-results.component';
import { FlightTripOptionsComponent } from './flight-trip-options/flight-trip-options.component';
import { FlightTripSummaryComponent } from './flight-trip-summary/flight-trip-summary.component';
import { FlightTripConfirmationComponent } from './flight-trip-confirmation/flight-trip-confirmation.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';

import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AuthGuard } from './_helpers/auth.guard.service';
import { AuthService } from './_helpers/auth.service';

import { AlertDialogComponent } from './_shared/alert-dialog/alert-dialog.component';

import { SidenavComponent } from './sidenav/sidenav.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './_components/_admin/users/users.component';
import { UserCreateComponent } from './_components/_admin/user-create/user-create.component';
import { UserEditComponent } from './_components/_admin/user-edit/user-edit.component';
import { UserDetailComponent } from './_components/_admin/user-detail/user-detail.component';
import { AirportsComponent } from './_components/_admin/airports/airports.component';
import { AirportCreateComponent } from './_components/_admin/airport-create/airport-create.component';
import { AirportEditComponent } from './_components/_admin/airport-edit/airport-edit.component';
import { AirportDetailComponent } from './_components/_admin/airport-detail/airport-detail.component';
import { AircraftsComponent } from './_components/_admin/aircrafts/aircrafts.component';
import { AircraftCreateComponent } from './_components/_admin/aircraft-create/aircraft-create.component';
import { AircraftEditComponent } from './_components/_admin/aircraft-edit/aircraft-edit.component';
import { AircraftDetailComponent } from './_components/_admin/aircraft-detail/aircraft-detail.component';
import { InventoryComponent } from './_components/_admin/inventory/inventory.component';
import { InventoryCreateComponent } from './_components/_admin/inventory-create/inventory-create.component';
import { InventoryEditComponent } from './_components/_admin/inventory-edit/inventory-edit.component';
import { InventoryDetailComponent } from './_components/_admin/inventory-detail/inventory-detail.component';
import { EquipmentsComponent } from './_components/_admin/equipments/equipments.component';
import { TripsComponent } from './trips/trips.component';

const appRoutes: Routes = [
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
    component: FlightsComponent,
    data: { title: 'Flights List' }
  },
  {
    path: 'flight-create',
    component: FlightCreateComponent,
    data: { title: 'Create Flight' }
  },
  {
    path: 'flight-edit/:id',
    component: FlightEditComponent,
    data: { title: 'Edit Flight' }
  },
  {
    path: 'flight-detail/:id',
    component: FlightDetailComponent,
    data: { title: 'Flight Details' }
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
    path: 'user-edit/:id',
    component: UserEditComponent,
    data: { title: 'Edit User' }
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    data: { title: 'User Details' }
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
    path: 'airport-edit/:id',
    component: AirportEditComponent,
    data: { title: 'Edit Airport' }
  },
  {
    path: 'airport-detail/:id',
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
    path: 'aircraft-edit/:id',
    component: AircraftEditComponent,
    data: { title: 'Edit Aircraft' }
  },
  {
    path: 'aircraft-detail/:id',
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
  imports: [
    RouterModule.forRoot(
      appRoutes
      //{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule.withServerTransition({ appId: 'myApp' }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,

    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,

    // Material
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
    MatTreeModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    MessageComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    FlightsComponent,
    HotelSearchComponent,
    CarSearchComponent,
    FlightDetailComponent,
    FlightCreateComponent,
    FlightEditComponent,
    FlightSearchComponent,
    FlightSearchResultsComponent,
    FlightTripOptionsComponent,
    FlightTripSummaryComponent,
    FlightTripConfirmationComponent,
    AdminComponent,
    TripsComponent,
    ShoppingcartComponent,
    AlertDialogComponent,
    SidenavComponent,
    UsersComponent,
    AircraftsComponent,
    AirportsComponent,
    InventoryComponent,
    EquipmentsComponent,
    UserCreateComponent,
    UserEditComponent,
    UserDetailComponent,
    AirportDetailComponent,
    AirportCreateComponent,
    AirportEditComponent,
    AircraftCreateComponent,
    AircraftEditComponent,
    AircraftDetailComponent,
    InventoryDetailComponent,
    InventoryCreateComponent,
    InventoryEditComponent
  ],
  providers: [
    MessageService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 2500}
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ShoppingcartComponent, AlertDialogComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'IN THE BROWSER' : 'ON THE SERVER';
    console.log('Running " ' + platform + ' " with appId= ' + appId);
  }
}
