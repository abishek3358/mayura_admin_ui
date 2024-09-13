import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageForgotPasswordComponent } from './main/admin/authentication/manage-forgot-password/manage-forgot-password.component';
import { ManageLoginComponent } from './main/admin/authentication/manage-login/manage-login.component';


import { AuthForgotPasswordV2Component } from './main/pages/authentication/auth-forgot-password-v2/auth-forgot-password-v2.component';
import { CountryComponent } from './main/admin/master/country/country.component';
import { StateComponent } from './main/admin/master/state/state.component';
import { CityComponent } from './main/admin/master/city/city.component';
// import { VendorComponent } from './main/admin/vendor management/vendor/vendor.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CancelledComponent } from './main/admin/manage-orders/cancelled/cancelled.component';




const appRoutes: Routes = [
  {
    path: "login", component: ManageLoginComponent
  },
  {
    path: "forgot-password",
    component: ManageForgotPasswordComponent
  },



  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: 'app', loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'vendor', loadChildren: () => import('./main/admin/vendor.module').then(m => m.VendorModule), canActivate: [AuthGuard] },

];

@NgModule({
  declarations: [
    AppComponent,
    ManageLoginComponent,
    CancelledComponent,
    // VendorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    NgxSpinnerModule,
    NgbDatepickerModule,
    GooglePlaceModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    // ! IMPORTANT: Provider used to create fake backend, comment while using real API
    fakeBackendProvider
  ],
  entryComponents: [
    // BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
