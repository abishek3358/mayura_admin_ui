import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule, } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { AuthenticationModule } from './authentication/authentication.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AuthResetPasswordV1Component } from 'app/main/pages/authentication/auth-reset-password-v1/auth-reset-password-v1.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ContractorComponent } from './contractor/contractor.component';
import { ContractorFormComponent } from './contractor-form/contractor-form.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { SubContractWorkOrderComponent } from './sub-contract-work-order/sub-contract-work-order.component';
import { SubContractWorkOrderFormComponent } from './sub-contract-work-order-form/sub-contract-work-order-form.component';
import { SubContractWorkOrderViewComponent } from './sub-contract-work-order-view/sub-contract-work-order-view.component';
import { NgxPrintModule } from 'ngx-print';
import { SubContractorBoqComponent } from './sub-contractor-boq/sub-contractor-boq.component';
import { SubControrBoqTableComponent } from './sub-contror-boq-table/sub-contror-boq-table.component';
import { NewSubContractorWorkOrderComponent } from './new-sub-contractor-work-order/new-sub-contractor-work-order.component';
import { SubContractorBillComponent } from './sub-contractor-bill/sub-contractor-bill.component';
import { SubContractorBillFormComponent } from './sub-contractor-bill-form/sub-contractor-bill-form.component';
import { ScBillRecordPaymentComponent } from './sc-bill-record-payment/sc-bill-record-payment.component';
import { SubContractorBillViewComponent } from './sub-contractor-bill-view/sub-contractor-bill-view.component';
import { ManagePasswordComponent } from '../admin/manage-password/manage-password.component';

const routes: Routes = [
  // { path: 'master', loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule) },

  { path: 'project', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule) },
  
  { path: 'accounts',loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule)},
  
  {
    path: 'user/new',
    component: UserFormComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'user/:id',
    component: UserFormComponent
  },
  {
    path: 'sub/contract/view/:id',
    component: SubContractWorkOrderViewComponent
  },
  {
    path: 'sub/contract',
    component: SubContractWorkOrderComponent
  },
  {
    path: 'sub/contract/new',
    component: NewSubContractorWorkOrderComponent
  },
  {
    path: 'sub/contract/:id',
    component: NewSubContractorWorkOrderComponent
  },
  {
    path: 'customer',
    component: CustomerComponent
  },
  {
    path: 'customer/new',
    component: CustomerFormComponent,
    data: { Animation: 'wizard' }
  },
  {
    path: 'customer/:id',
    component: CustomerFormComponent,
    data: { Animation: 'wizard' }
  },
  {
    path: 'customer/:id',
    component: CustomerFormComponent,
    data: { Animation: 'wizard' }
  },
  {
    path: "contractor",
    component: ContractorComponent
  },
  {
    path: "contractor/new",
    component: ContractorFormComponent,
    data: { animation: 'wizard' }
  },
  {
    path: "contractor/:id",
    component: ContractorFormComponent,
    data: { animation: 'wizard' }
  },
  {
    path: 'vendor',
    component: VendorComponent
  },
  {
    path: 'vendor/new',
    component: VendorFormComponent,
    data: { Animation: 'wizard' }
  },
  {
    path: 'vendor/:id',
    component: VendorFormComponent,
    data: { Animation: 'wizard' }
  },
  {
    path: 'sub/contractor/boq',
    component: SubControrBoqTableComponent
  },
  {
    path: 'sub/contractor/boq/new',
    component: SubContractorBoqComponent
  },
  {
    path: 'sub/contractor/boq/:id',
    component: SubContractorBoqComponent
  },
  {
    path: 'sub/contractor/bill',
    component: SubContractorBillComponent
  },
  {
    path: 'sub/contractor/bill/view/:id',
    component: SubContractorBillViewComponent
  },
  {
    path: 'sub/contractor/bill/new',
    component: SubContractorBillFormComponent
  },
  {
    path: 'sub/contractor/bill/:id',
    component: SubContractorBillFormComponent
  },
  {
    path: 'sub/contractor/bill/payment/:id',
    component: ScBillRecordPaymentComponent
  }
]

@NgModule({
  declarations: [
    UserComponent,
    UserFormComponent,
    SubContractWorkOrderComponent,
    SubContractWorkOrderFormComponent,
    SubContractWorkOrderViewComponent,
    ContractorComponent,
    ContractorFormComponent,
    VendorComponent,
    VendorFormComponent,
    CustomerComponent,
    CustomerFormComponent,
    SubContractorBoqComponent,
    SubControrBoqTableComponent,
    NewSubContractorWorkOrderComponent,
    SubContractorBillComponent,
    SubContractorBillFormComponent,
    ScBillRecordPaymentComponent,
    SubContractorBillViewComponent,

  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    AuthenticationModule,
    MiscellaneousModule,
    Ng2FlatpickrModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
    NgbNavModule,
    NgbAccordionModule,
    RouterModule.forChild(routes),
    SimplebarAngularModule,
    NgxPrintModule

  ],

  providers: []
})
export class PagesModule { }
