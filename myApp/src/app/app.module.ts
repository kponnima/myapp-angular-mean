import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
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
import { AuthInterceptor } from './common-services/auth.interceptor';
import { MessageService } from './common-services/message.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { FlightComponent } from './flight/flight.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { CarSearchComponent } from './car-search/car-search.component';

import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { FlightCreateComponent } from './flight-create/flight-create.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearchResultsComponent } from './flight-search-results/flight-search-results.component';
import { FlightTripOptionsComponent } from './flight-trip-options/flight-trip-options.component';
import { FlightTripSummaryComponent } from './flight-trip-summary/flight-trip-summary.component';
import { FlightTripConfirmationComponent } from './flight-trip-confirmation/flight-trip-confirmation.component';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { TripsComponent } from './trips/trips.component';
import { AuthGuard } from './common-services/auth.guard.service';
import { AuthService } from './common-services/auth.service';

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
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
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
    BrowserModule.withServerTransition({ appId: 'myApp' }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
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
    MessageComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    FlightComponent,
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
    TripsComponent
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
  bootstrap: [AppComponent]
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
