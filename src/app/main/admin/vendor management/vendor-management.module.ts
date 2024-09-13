import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { VendorComponent } from './vendor/vendor.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ManageVendorComponent } from './manage-vendor/manage-vendor.component';

const routes: Routes = [
  {path:"vendors",component:VendorComponent},
{ path:"vendors/manage-vendor", component:ManageVendorComponent},
{ path:"vendors/manage-vendor/:id", component:ManageVendorComponent},


]

@NgModule({
  declarations: [
    ManageVendorComponent,
    VendorComponent
 
    
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
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class VendorManagementModule { }
