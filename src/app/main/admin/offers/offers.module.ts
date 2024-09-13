import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbDropdownModule, NgbPaginationModule, NgbDatepickerModule, NgbTooltipModule, NgbCollapseModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffersComponent } from './offers/offers.component';
import { ManageOfferComponent } from './manage-offer/manage-offer.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';


const routes: Routes = [
  {path:"offers",component:OffersComponent
},

  {
    path:"offers/manage-offer",component:ManageOfferComponent
},
  {path:"offers/:id",component:OffersComponent},
  {
    path:"offers/manage-offer/:id",component:ManageOfferComponent
},



]
@NgModule({
  declarations: [ 
    OffersComponent,
    ManageOfferComponent,
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
    AngularEditorModule,
    
    
  ],
  providers: [DatePipe]
})
export class OffersModule { }
