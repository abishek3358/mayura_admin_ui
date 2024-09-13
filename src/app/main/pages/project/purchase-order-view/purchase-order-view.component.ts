import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CompanySettingService } from '../../masters/company-setting/company-setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../purchase-order-form/purchase-order.service';
@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss']
})
export class PurchaseOrderViewComponent implements OnInit {
  companyAddressObj: any = {};
  waitingForTheResponse: boolean = false;
  poObj: any = {};
  purchaseOrderView:any = [];
  purchaseOrderMaterialDTOList = [];
  constructor(
    private companyDetails: CompanySettingService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: ActivatedRoute,
    private PurchaseOrderService: PurchaseOrderService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
     let id = this.router.snapshot.params['id'];
    if (id) {
      this.getView(id);
    }
    this.getAddress();
    this.getPO(this.router.snapshot.params['id']);

  }
  getView(id) {
    this.PurchaseOrderService.view(id).pipe(first()).subscribe(res => {
      this.purchaseOrderView = res.data;
      console.log('view', this.purchaseOrderView);
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err=>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
    
  }
  getAddress() {
    this.companyDetails.getcompany().pipe(first()).subscribe(res => {
      this.companyAddressObj = res.data;
      this.waitingForTheResponse = true;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getPO(id) {
    this.PurchaseOrderService.getSingleProject(id).pipe(first()).subscribe(res => {
      this.poObj = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
