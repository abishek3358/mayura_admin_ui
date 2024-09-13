import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService } from '../order.service';
declare let $: any;
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-pending',
  templateUrl: './manage-pending.component.html',
  styleUrls: ['./manage-pending.component.scss']
})
export class ManagePendingComponent implements OnInit {
  venArr:any={};
  customerOrderId:any;
  id:any
  obj:any={};
  vendorObj:any=[];
  data:any;
objj:any;
vendorId:any;
status='ALLOCATED'
  venObj: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: OrderService,
    private spinner: NgxSpinnerService, 
     private toastr: ToastrService
  ) { }
  
  ngOnInit(): void {
    this.spinner.show();
    this.customerOrderId = this.route.snapshot.params['id']
  
     if (this.customerOrderId) {
      this.getPending();
    }
    
   
  }

getPending() {
   $('#pending').DataTable( ).clear().destroy();
  this.service.getVendor(this.customerOrderId).pipe(first()).subscribe(res => {
     $(document).ready(function () {
       $('#pending').DataTable({
        "iDisplayLength": 25
       })
     });
    this.venArr = res.data;
    this.venObj = res.data;
    this.obj = res.data.deliveryAddressDtoObj
    this.vendorObj =res.data.vendorDtlList
    this.toastr.success(res.message);
     this.spinner.hide();
  
  },
  err => {
    this.spinner.hide();
    this.toastr.error(err.error.error.message);
  }
   
  )
}


submit(){
 
 
  this.objj={
    customerId:this.venArr.customerId,
    customerOrderId:this.venArr.customerOrderId,
    vendorId:  this.vendorId,
    vendorOrderStatus:'ALLOCATED'
  }
   
  this.service. getAllocated(this.objj).subscribe(res=>{
    this.toastr.success(res.data);
    this.router.navigate(['admin/order-management/allocated-orders']);
   }
    ,
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
}
onClick(vendor) {
 
  
  this.objj = vendor
  this.vendorId=this.objj.id

}


}
