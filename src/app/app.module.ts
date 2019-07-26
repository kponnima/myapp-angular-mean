import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { MessageComponent } from './_components/_shared/message/message.component';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { MessageService } from './_helpers/message.service';
import { LoginComponent } from './_components/_shared/login/login.component';
import { SignupComponent } from './_components/_shared/signup/signup.component';
import { HomeComponent } from './_components/_shared/home/home.component';
import { FlightsComponent } from './_components/_admin/flights/flights.component';
import { HotelSearchComponent } from './_components/_hotels/hotel-search/hotel-search.component';
import { CarSearchComponent } from './_components/_cars/car-search/car-search.component';

import { FlightDetailComponent } from './_components/_admin/flight-detail/flight-detail.component';
import { FlightCreateComponent } from './_components/_admin/flight-create/flight-create.component';
import { FlightEditComponent } from './_components/_admin/flight-edit/flight-edit.component';
import { FlightSearchComponent } from './_components/_flights/flight-search/flight-search.component';
import { FlightSearchResultsComponent } from './_components/_flights/flight-search-results/flight-search-results.component';
import { FlightTripOptionsComponent } from './_components/_flights/flight-trip-options/flight-trip-options.component';
import { FlightTripSummaryComponent } from './_components/_flights/flight-trip-summary/flight-trip-summary.component';
import { FlightTripConfirmationComponent } from './_components/_flights/flight-trip-confirmation/flight-trip-confirmation.component';
import { ShoppingcartComponent } from './_components/_flights/shoppingcart/shoppingcart.component';

import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

import { AuthGuard } from './_helpers/auth.guard.service';
import { AuthService } from './_helpers/auth.service';

import { AlertDialogComponent } from './_components/_shared/alert-dialog/alert-dialog.component';

import { AdminComponent } from './_components/_admin/admin/admin.component';
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
import { TripsComponent } from './_components/_flights/trips/trips.component';
import { ProfileComponent } from './_components/_shared/profile/profile.component';
@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'myApp' }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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
    MatTreeModule
  ],
  declarations: [
    AppComponent,
    MessageComponent,
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
    InventoryEditComponent,
    ProfileComponent
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
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ShoppingcartComponent, AlertDialogComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(APP_ID) appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'IN THE BROWSER' : 'ON THE SERVER';
    console.log('Running " ' + platform + ' " with appId= ' + appId);
  }
}
