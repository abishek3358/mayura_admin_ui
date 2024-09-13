import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllocatedOrderComponent } from './allocated-order/allocated-order.component';
import { ShippedListComponent } from './allocated-order/shipped-list/shipped-list.component';
import { DeliverdListComponent } from './deliverd-list/deliverd-list.component';
import { DeliveredComponent } from '../manage-orders/delivered/delivered.component';


const routes: Routes = [
  {
    path:"allocated",component:AllocatedOrderComponent
},
{
  path:"vendor-order/shippedList",component:ShippedListComponent
},
{
  path:"vendor-order/shippedList/:id",component:ShippedListComponent
},

{
  path:"vendor-order/delivered-list",component:DeliverdListComponent
},
{
  path:"vendor-order/delivered-list/:id",component:DeliverdListComponent
},

]

@NgModule({
  declarations: [
    AllocatedOrderComponent,
    ShippedListComponent,
    DeliverdListComponent,
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
    NgSelectModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,   
  ]
})
export class VendorOrdersModule { }
