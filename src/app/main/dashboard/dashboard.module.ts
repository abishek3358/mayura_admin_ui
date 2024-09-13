import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';
import { NgxChartistModule } from 'ngx-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountToModule } from 'angular-count-to';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreCommonModule } from '@core/common.module';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import { ProjectComponent } from './../pages/project/project/project.component';
import { AccountsComponent } from '../pages/accounts/accounts/accounts.component';


const routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], animation: 'danalytics' },
   
  },
  {
    path: '',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
  {
    path: "project",
    component: ProjectComponent
  },
  {
    path: "accounts",
    component: AccountsComponent
  },
];

@NgModule({
  declarations: [AnalyticsComponent, EcommerceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxChartistModule,
    ChartsModule,
    CountToModule,

    NgxChartsModule
   
  ],
  providers: [DashboardService],
  exports: [EcommerceComponent]
})
export class DashboardModule { }
