import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
// import { VendorManagementModule } from '../admin/vendor management/vendor-management.module';
import { AuthGuard } from 'app/auth/helpers';
import { UsersComponent } from './users/users.component';
import { ManageUserComponent } from './users/manage-user/manage-user.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { OffersModule } from './offers/offers.module';
import { ManageOrdersModule } from './manage-orders/manage-orders.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { MyProfileComponent } from './users/my-profile/my-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./authentication/auth.module').then(m => m.AuthModule) },
  { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule), canActivate: [AuthGuard] },
  { path: 'vendor-management', loadChildren: () => import('./vendor management/vendor-management.module').then(m => m.VendorManagementModule) },
  { path: 'offer-management', loadChildren: () => import('./offers/offers.module').then(m => m.OffersModule) },
  { path: 'order-management', loadChildren: () => import('./manage-orders/manage-orders.module').then(m => m.ManageOrdersModule) },


  {
    path: 'users', component: UsersComponent
  },
  {
    path: 'users/manage-user', component: ManageUserComponent
  },
  {
    path: 'users/manage-user/:id', component: ManageUserComponent
  },
  {
    path: 'admin/users', component: UsersComponent
  },

  {
    path: 'change/password',
    component: ManagePasswordComponent
  },
  {
    path: 'user/my-profile',
    component: MyProfileComponent
  },

]


@NgModule({
  declarations: [
    UsersComponent,
    MyProfileComponent,
    ManageUserComponent,
    ManagePasswordComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModalModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbCollapseModule,
    NgbModule,
    NgbTooltipModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgbAccordionModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    SimplebarAngularModule,
    // VendorManagementModule,
    OffersModule,
    ManageOrdersModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,


  ]
})
export class AdminModule { }
