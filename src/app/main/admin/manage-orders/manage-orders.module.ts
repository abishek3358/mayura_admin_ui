import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingComponent } from './pending/pending.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagePendingComponent } from './manage-pending/manage-pending.component';
import { PackingComponent } from './packing/packing.component';
import { OutForDeliveryComponent } from './out-for-delivery/out-for-delivery.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { DeliveredComponent } from './delivered/delivered.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CancelledComponent } from './cancelled/cancelled.component';

const routes: Routes = [
  {path:"pending",component:PendingComponent},
  
  {path:"pending/manage-pending",component:ManagePendingComponent},
  {path:"pending/manage-pending/:id",component:ManagePendingComponent},

  {path:"allocated-orders",component:PackingComponent},
  {path:"allocated-orders/out-for-delivery",component:OutForDeliveryComponent},
  {path:"delivered",component:DeliveredComponent},
  {path:"rejected-orders",component:CancelledComponent},
]





@NgModule({
  declarations: [
    PendingComponent,
    ManagePendingComponent,
    PackingComponent,
    OutForDeliveryComponent,
    DeliveredComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,HttpClientModule,
    NgbDropdownModule,
    NgSelectModule ,
    SimplebarAngularModule,
    
  ]
})
export class ManageOrdersModule { }
