import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { StateComponent } from './state/state.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { UomComponent } from './uom/uom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GstComponent } from './gst/gst.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http'

import { BrandComponent } from './brand/brand.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { ManageRewardComponent } from './manage-reward/manage-reward.component';
const routes: Routes = [
  {
    path: "brand", component: BrandComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "uom", component: UomComponent
  },
  {
    path: "product-category", component: ProductCategoryComponent
  },
  {
    path: "country", component: CountryComponent
  },
  {
    path: "city", component: CityComponent
  },
  {
    path: "state",
    component: StateComponent
  },
  {
    path: "gst",
    component: GstComponent
  },
  {
    path: "product-type", component: ProductTypeComponent
  },
  {
    path: "products", component: ProductComponent
  },
  {
    path: "product/:id", component: ProductComponent
  },
  {
    path: "products/manage-product/:id", component: ProductListComponent
  },
  {
    path: "products/manage-product", component: ProductListComponent
  },
  {
    path: "reward", component: ManageRewardComponent
  },


]
@NgModule({
  declarations: [
    CountryComponent,
    StateComponent,
    CityComponent,
    UomComponent,

    GstComponent,
    ProductCategoryComponent,
    ProductTypeComponent,
    ProductComponent,
    ProductListComponent,
    BrandComponent,
    ManageRewardComponent,

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
    NgbAccordionModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    FormsModule,
    SimplebarAngularModule,
    AngularEditorModule,
    HttpClientModule,
    ReactiveFormsModule

  ]
})
export class MasterModule { }
