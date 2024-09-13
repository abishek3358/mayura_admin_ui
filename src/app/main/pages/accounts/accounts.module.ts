import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CreditComponent } from './credit/credit.component';
import { DebitComponent } from './debit/debit.component';
import { CreditFormComponent } from './credit-form/credit-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { VoucherComponent } from './voucher/voucher.component';
import { MisExpenseComponent } from './mis-expense/mis-expense.component';
import { MisExpenseFormComponent } from './mis-expense/mis-expense-form/mis-expense-form.component';
import { VoucherFormComponent } from './voucher-form/voucher-form.component';
import { DebitFormComponent } from './debit-form/debit-form.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { BillComponent } from './bill/bill.component';
import { BillFormComponent } from './bill-form/bill-form.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgxPrintModule } from 'ngx-print';
import { BillsViewComponent } from './bills-view/bills-view.component';
import { WagesComponent } from './wages/wages.component';
import { SalaryComponent } from './salary/salary.component';
import { PaymentComponent } from './payment/payment.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InvoiceRecordPaymentComponent } from './invoice-record-payment/invoice-record-payment.component';
import { BillsRecordPaymentComponent } from './bills-record-payment/bills-record-payment.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { AccountGroupComponent } from './account-group/account-group.component';
import { WagesFormComponent } from './wages/wages-form/wages-form.component';
import { WagesViewComponent } from './wages-view/wages-view.component';
import { WagesRecordPaymentComponent } from './wages-record-payment/wages-record-payment.component';

const routes: Routes = [
  {
    path: "credit",
    component: CreditComponent
  },
  {
    path: "credit/new",
    component: CreditFormComponent
  },
  {
    path: "credit/:id",
    component: CreditFormComponent
  },
  {
    path: "debit",
    component: DebitComponent
  },
  {
    path: "debit/new",
    component: DebitFormComponent
  },
  {
    path: "debit/:id",
    component: DebitFormComponent
  },
  {
    path: 'voucher',
    component: VoucherComponent
  },
  {
    path: "voucher/new",
    component: VoucherFormComponent
  },
  {
    path: 'voucher/:id',
    component: VoucherFormComponent
  },
  {
    path: "mis/expense",
    component: MisExpenseComponent
  },
  {
    path: "mis/expense/new",
    component: MisExpenseFormComponent
  },
  {
    path: "mis/expense/:id",
    component: MisExpenseFormComponent,
  },
  {
    path: "invoice/view",
    component: InvoiceViewComponent
  },
  {
    path: "invoice/view/:id",
    component: InvoiceViewComponent
  },
  {
    path: "bills",
    component: BillComponent
  },
  {
    path: "bills/new",
    component: BillFormComponent
  },
  {
    path: "bills/view/:id",
    component: BillsViewComponent
  },
  {
    path: "bills/:id",
    component: BillFormComponent
  },
  {
    path: "invoice",
    component: InvoiceTableComponent,
  },
  {
    path: "invoice/new",
    component: InvoiceComponent,
  },
  {
    path: "invoice/:id",
    component: InvoiceComponent,
  },
  {
    path: "wages",
    component: WagesComponent
  },
  {
    path: "wages/new",
    component: WagesFormComponent
  },
  {
    path: "wages/new/:id",
    component: WagesFormComponent,
  },
  {
    path: "wages/view/:id/:month",
    component: WagesViewComponent,
  },
  {
    path:'wages/record/payment/:id',
    component:WagesRecordPaymentComponent
  },

  {
    path: "salary",
    component: SalaryComponent,
  },
  {
    path: "payment",
    component: PaymentComponent,
  },
  {
    path: "account",
    component: AccountsComponent,
  },
  {
    path: "invoice/record/payment/:id",
    component: InvoiceRecordPaymentComponent
  },
  {
    path: "bills/record/payment/:id",
    component: BillsRecordPaymentComponent
  },
  {
    path: "profit/and/loss",
    component: ProfitAndLossComponent
  },
  {
    path: "account/group",
    component: AccountGroupComponent
  },


]

@NgModule({
  declarations: [
    CreditComponent,
    DebitComponent,
    DebitFormComponent,
    CreditFormComponent,
    VoucherComponent,
    MisExpenseComponent,
    MisExpenseFormComponent,
    VoucherFormComponent,
    InvoiceViewComponent,
    BillComponent,
    BillFormComponent,
    InvoiceComponent,
    InvoiceTableComponent,
    BillsViewComponent,
    WagesComponent,
    SalaryComponent,
    PaymentComponent,
    AccountsComponent,
    InvoiceRecordPaymentComponent,
    BillsRecordPaymentComponent,
    ProfitAndLossComponent,
    AccountGroupComponent,
    WagesFormComponent,
    WagesViewComponent,
    WagesRecordPaymentComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbCollapseModule,
    NgSelectModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgbAccordionModule,
    NgbPaginationModule,
    NgxPrintModule
  ]
})
export class AccountsModule { }
