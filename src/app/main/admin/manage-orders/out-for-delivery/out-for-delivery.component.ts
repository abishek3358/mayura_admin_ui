import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ManageVendorService } from '../../vendor management/manage-vendor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-out-for-delivery',
  templateUrl: './out-for-delivery.component.html',
  styleUrls: ['./out-for-delivery.component.scss']
})
export class OutForDeliveryComponent implements OnInit {
  shippedFormSubmitted = false;
  status = "DELIVERED";
  orderPendingArr: any = [];
  deliveredArr:any = []
  shippedForm: FormGroup;
  vendorArr: any;
  orderArr: any;
start:any;
end:any;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private manageVendorService: ManageVendorService,
      private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): 
  void {
    this.shippedForm = this.formBuilder.group({
      startDate:[null,Validators.required],
      endDate: [null,Validators.required],
      vendorName:[null,Validators.required],
    

    })
    this.getVendor();
  
  
  }
 
  get f() { return this.shippedForm.controls };


  
  outForDelivery() {
    this.shippedFormSubmitted = true;
    if (this.shippedForm.invalid) {
      return;
    } 
     this. startTime();
    this. endTime();
    this.orderService.orderPending(this.status,this.shippedForm.value).pipe(first()).subscribe(res => {
      this.orderArr = res.data;
      $(document).ready(function () {
        $('#pending').DataTable({
          "iDisplayLength": 100
        });
      })
    })}
   

  
  getVendor() {
    this.manageVendorService.getVendor().pipe(first()).subscribe(res => {
      this.vendorArr = res.data;
      $('#pending').DataTable().clear().destroy();

      // this. startTime();
      // this. endTime();
      this.orderService.orderPending(this.status,this.shippedForm.value).pipe(first()).subscribe(res => {
        this.orderArr = res.data;
        $(document).ready(function () {
          $('#pending').DataTable({
            "iDisplayLength": 100
          });
        })
      })
    }
    ,
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
 
  startTime(){
    let val = this.shippedForm.value.startDate.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val = val.join(' ');
    this.shippedForm.patchValue({
      startDate: val
    })
  }

  endTime(){
    let val = this.shippedForm.value.endDate.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val = val.join(' ');
    this.shippedForm.patchValue({
      endDate: val
    })
  }
  
}
