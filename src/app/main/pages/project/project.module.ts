import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlantMachinaryComponent } from './plant-machinary/plant-machinary.component';
import { ManageProjectFormComponent } from './manage-project-form/manage-project-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PlantMachineryFormComponent } from './plant-machinery-form/plant-machinery-form.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
// import { SubContractWorkOrderComponent } from './sub-contract-work-order/sub-contract-work-order.component';
// import { SubContractWorkOrderFormComponent } from './sub-contract-work-order-form/sub-contract-work-order-form.component';
import { ProjectContactComponent } from './project-contact/project-contact.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { WorkOrderFormComponent } from './work-order-form/work-order-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SimplebarAngularModule } from 'simplebar-angular';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { NgxPrintModule } from 'ngx-print';
import { LossComponent } from './profit/loss/loss.component';
import { ReportsComponent } from './reports/reports.component';
// import { SubContractWorkOrderViewComponent } from './sub-contract-work-order-view/sub-contract-work-order-view.component';
import { ProjectComponent } from './project/project.component';
import { BillOfQuantityComponent } from './bill-of-quantity/bill-of-quantity.component';
import { BillOfQuantityTableComponent } from './bill-of-quantity-table/bill-of-quantity-table.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeAttendanceViewComponent } from './employee-attendance-view/employee-attendance-view.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeFormComponent } from './employee/employee-form/employee-form.component';
import { BillOfQuantityViewComponent } from './bill-of-quantity-view/bill-of-quantity-view.component';
import { PurchaseRecordPaymentComponent } from './purchase-record-payment/purchase-record-payment.component';
import { ManageProjectReportComponent } from './manage-project-report/manage-project-report.component';


const routes: Routes = [
  {
    path: 'manage/project',
    component: ManageProjectComponent
  },
  {
    path: 'manage/project/new',
    component: ManageProjectFormComponent
  },
    {
    path: 'manage/project/report/:id',
    component: ManageProjectReportComponent
  },
  {
    path: 'manage/project/:id',
    component: ManageProjectFormComponent
  },

  {
    path: 'plant/machinery',
    component: PlantMachinaryComponent
  },
  {
    path: 'plant/machinery/new',
    component: PlantMachineryFormComponent
  },
  {
    path: "plant/machinery/:id",
    component: PlantMachineryFormComponent,
    data: { animation: 'wizard' }
  },
  {
    path: 'purchase/order',
    component: PurchaseOrderComponent
  },
  {
    path: 'purchase/order/new',
    component: PurchaseOrderFormComponent
  },
  {
    path: 'purchase/order/view/:id',
    component: PurchaseOrderViewComponent
  },
  {
    path: 'purchase/order/:id',
    component: PurchaseOrderFormComponent
  },
  {
    path:'purchase/order/record/payment/:id',
    component:PurchaseRecordPaymentComponent
  },
  //  {
  //   path:'sub/contract/view/:id',
  //   component:SubContractWorkOrderViewComponent
  //  },
  //   {
  //     path: 'sub/contract',
  //     component: SubContractWorkOrderComponent
  //   },
  //   {
  //     path: 'sub/contract/new',
  //     component: SubContractWorkOrderFormComponent
  //   },
  //   {
  //     path: 'sub/contract/:id',
  //     component: SubContractWorkOrderFormComponent
  //   },
  {
    path: 'project/contacts',
    component: ProjectContactComponent
  },
  {
    path: 'project/contacts/:id',
    component: ProjectContactComponent
  },
  {
    path: 'work-order',
    component: WorkOrderComponent
  },
  {
    path: "work-order/new",
    component: WorkOrderFormComponent
  },
  {
    path: 'profit/loss',
    component: LossComponent
  },
  {
    path: "report",
    component: ReportsComponent
  },
  {
    path: "project",
    component: ProjectComponent
  },
  {
    path: 'bill/of/quantity',
    component: BillOfQuantityTableComponent
  },
  {
    path: 'bill/of/quantity/new',
    component: BillOfQuantityComponent
  },
  {
    path: 'bill/of/quantity/:id',
    component: BillOfQuantityComponent
  },
  {
    path:'bill/of/quantity/view/:id',
    component: BillOfQuantityViewComponent
  },
  {
    path: 'emp/attendance',
    component: EmployeeAttendanceViewComponent
  },
  {
    path: 'emp/attendance/view',
    component: EmployeeAttendanceComponent
  },
  {
    path: 'emp/attendance/view/:id',
    component: EmployeeAttendanceComponent
  },
  {
    path: "employee",
    component: EmployeeComponent
  },
  {
    path: "employee/new",
    component: EmployeeFormComponent
  },
  {
    path: "employee/:id",
    component: EmployeeFormComponent
  },

]

@NgModule({
  declarations: [
    ManageProjectComponent,
    PlantMachinaryComponent,
    ManageProjectFormComponent,
    PlantMachineryFormComponent,
    PurchaseOrderComponent,
    PurchaseOrderFormComponent,
    // SubContractWorkOrderComponent,
    // SubContractWorkOrderFormComponent,
    ProjectContactComponent,
    WorkOrderComponent,
    WorkOrderFormComponent,
    PurchaseOrderViewComponent,
    LossComponent,
    ReportsComponent,
    // SubContractWorkOrderViewComponent,
    ProjectComponent,
    BillOfQuantityComponent,
    BillOfQuantityTableComponent,
    EmployeeComponent,
    EmployeeFormComponent,
    EmployeeAttendanceComponent,
    EmployeeAttendanceViewComponent,
    BillOfQuantityViewComponent,
    PurchaseRecordPaymentComponent,
    ManageProjectReportComponent


  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
    NgbAccordionModule,
    NgxPrintModule,
    AngularEditorModule,
    SimplebarAngularModule,
  ],

})
export class ProjectModule { }
