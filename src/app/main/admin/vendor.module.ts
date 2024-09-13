import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorOrdersModule } from '../admin/vendor-orders/vendor-orders.module';
import { VendorUserComponent } from './vendor-users/vendor-user/vendor-user.component';
import { VendorManageUserComponent } from './vendor-users/vendor-manage-user/vendor-manage-user.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./authentication/auth.module').then(m => m.AuthModule) },
  {path: 'vendor-order', loadChildren: () =>import('../admin/vendor-orders/vendor-orders.module').then(m=>m.VendorOrdersModule)},
{path:'vendor-user/vendor-manage-user' , component:VendorManageUserComponent},
{path:'vendor-user', component:VendorUserComponent}
]

@NgModule({
  declarations: [
    VendorManageUserComponent,
    VendorUserComponent
  ],
  imports: [
    CommonModule,
    VendorOrdersModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
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
    
  ]
})
export class VendorModule { }
