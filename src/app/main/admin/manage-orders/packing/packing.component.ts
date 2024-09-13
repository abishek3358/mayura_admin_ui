import { Component, OnInit } from '@angular/core';
import { ManageVendorService } from '../../vendor management/manage-vendor.service';
import { OrderService } from '../order.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {
  orderFormSubmitted = false;
  orderPendingArr: any = [];
  orderForm: FormGroup;
  vendorArr: any = [];
  orderArr: any;
  status = 'ALLOCATED'

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private manageVendorService: ManageVendorService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.orderForm = this.formBuilder.group({
      vendorName: [null],
      startDate: [null],
      endDate: [null]
    })
    // this.orderPending();
    this.getVendor();

  }
  get f() { return this.orderForm.controls };
  search() {
    $('#packing').DataTable().clear().destroy();
    this.orderService.orderPending(this.status, this.orderForm.value).pipe(first()).subscribe(res => {
      this.orderArr = res.data;
    })
    $(document).ready(function () {
      $('#packing-table').DataTable({
        "iDisplayLength": 25
      });
    })
  }
  orderPending() {
    this.orderFormSubmitted = true;
    if ((this.orderForm.value.startDate || this.orderForm.value.endDate || this.orderForm.value.vendorName) == null) {
      return;
    }else{
      let obj = this.orderForm.value;
      obj.startDate = this.startTime();
      obj.endDate = this.endTime();
      this.search()
    }

    // if (this.orderForm.value.vendorName) {
    //   this.search()
    // }
    // else if (this.orderForm.value.startDate && this.orderForm.value.endDate) {
    //   this.search();
    // } else if (this.orderForm.value.startDate && this.orderForm.value.endDate && this.orderForm.value.vendorName) {
    //   this.search()
    // }
  }

  getVendor() {
    this.manageVendorService.getVendor().pipe(first()).subscribe(res => {
      this.vendorArr = res.data;

      $('#packing').DataTable().clear().destroy();
      this.orderService.orderPending(this.status, this.orderForm.value).pipe(first()).subscribe(res => {
        this.orderArr = res.data;
        this.orderArr.sort((a: any, b: any) => {
          if (a.orderNo < b.orderNo) return -1;
          if (a.orderNo > b.orderNo) return 1;
          return 0;
        })
        $(document).ready(function () {
          $('#packing').DataTable({
            "iDisplayLength": 25
          });
        })

        this.toastr.success(res.message);
      })
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  startTime() {
    let val = this.orderForm.value.startDate;
    val = val.split('-').reverse().join('/');
    return val;
  }
  endTime() {
    let val = this.orderForm.value.endDate;
    val = val.split('-').reverse().join('/');
    return val;
  }

  onVendorClear() {
    this.getVendor();
  }
  formReset(){
    this.orderForm.reset({});
    this.getVendor();
  }
  // shipped(){
  //   // this.orderService.getShipped(this.status).pipe(first()).subscribe(res => {
  //   //   this.vendorArr = res.data;
  //   // })
  // }

}
