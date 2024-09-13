import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetComponent } from './asset/asset.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { UnitOfMeasurementComponent } from './unit-of-measurement/unit-of-measurement.component';
// import { CountryComponent } from 'app/main/admin/master/country/country.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CityComponent } from 'app/main/admin/master/city/city.component';
import { SacCodeComponent } from './sac-code/sac-code.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser'
// import { StateComponent } from 'app/main/admin/master/state/state.component';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyComponent } from './currency/currency.component';
import { CompanyListComponent } from './company-list/company-list.component';
// import { ContractorComponent } from './contractor/contractor.component';
// import { ContractorFormComponent } from './contractor-form/contractor-form.component';
import { AssetTypeComponent } from './asset-type/asset-type.component';
import Stepper from 'bs-stepper';
// import { VendorComponent } from './vendor/vendor.component';
// import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { CompanyContactsComponent } from './company-contacts/company-contacts.component';
// import { CustomerComponent } from './customer/customer.component';
// import { CustomerFormComponent } from './customer-form/customer-form.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component';
import { MaterialComponent } from './material/material.component';
import { AdvanceComponent } from './advance/advance.component';
import { ExecutionComponent } from './execution/execution.component';
import { SimplebarAngularModule } from 'simplebar-angular';
const routes: Routes = [
  {
    path: "asset",
    component: AssetComponent
  },
  {
    path: "assettype",
    component: AssetTypeComponent
  },
  {
    path: "uom", component: UnitOfMeasurementComponent
  },
  // {
  //   path: "country",
  //   component: CountryComponent
  // },
  // {
  //   path: "city",
  //   component: CityComponent
  // },
  {
    path: "sac/code",
    component: SacCodeComponent
  },
  {
    path: "company/setting",
    component: CompanySettingComponent
  },
  {
    path: "company/list",
    component: CompanyListComponent
  },
  {
    path: "company/contacts",
    component: CompanyContactsComponent
  },
  {
    path: "company/setting/new",
    component: CompanyListComponent,
    data: { animation: 'wizard' }
  },
  {
    path: "company/setting/:id",
    component: CompanyListComponent,
    data: { animation: 'wizard' }
  },
  // {
  //   path: "state",
  //   component: StateComponent
  // },
  {
    path: "currency",
    component: CurrencyComponent
  },
  {
    path: "material",
    component: MaterialComponent
  },
  {
    path: "advance",
    component: AdvanceComponent
  },
  // {
  //   path: "contractor",
  //   component: ContractorComponent
  // },
  // {
  //   path: "contractor/new",
  //   component: ContractorFormComponent,
  //   data: { animation: 'wizard' }
  // },
  // {
  //   path: "contractor/:id",
  //   component: ContractorFormComponent,
  //   data: { animation: 'wizard' }
  // },
  // {
  //   path: 'vendor',
  //   component: VendorComponent
  // },
  // {
  //   path: 'vendor/new',
  //   component: VendorFormComponent,
  //   data: { Animation: 'wizard' }
  // },
  // {
  //   path: 'vendor/:id',
  //   component: VendorFormComponent,
  //   data: { Animation: 'wizard' }
  // },
  {
    path: 'vehicle/type',
    component:VehicleTypeComponent
  },
  // {
  //   path: 'customer',
  //   component: CustomerComponent
  // },
  // {
  //   path: 'customer/new',
  //   component: CustomerFormComponent,
  //   data: { Animation: 'wizard' }
  // },
  // {
  //   path: 'customer/:id',
  //   component: CustomerFormComponent,
  //   data: { Animation: 'wizard' }
  // },
  // {
  //   path: 'customer/:id',
  //   component: CustomerFormComponent,
  //   data: { Animation: 'wizard' }
  // },
  {
    path:'category',
    component:CategoryComponent
  },
 {
   path:'execution',
   component:ExecutionComponent
 }

]

@NgModule({
  declarations: [
    AssetComponent,
    AssetTypeComponent,
    UnitOfMeasurementComponent,
    // CountryComponent,
    // CityComponent,
    SacCodeComponent,
    CompanySettingComponent,
    // StateComponent,
    CurrencyComponent,
    CompanyListComponent,
    // ContractorComponent,
    // ContractorFormComponent,
    // VendorComponent,
    // VendorFormComponent,
    VehicleTypeComponent,
    CompanyContactsComponent,
    // CustomerComponent,
    // CustomerFormComponent,
    CategoryComponent,
    MaterialComponent,
    AdvanceComponent,
    ExecutionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbCollapseModule,
    NgbNavModule,
    NgbAccordionModule,
    HttpClientModule,
    SimplebarAngularModule
  ]
})
export class MastersModule { }
