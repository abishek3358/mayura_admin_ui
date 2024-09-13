import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ManageVendorService } from '../../vendor management/manage-vendor.service';
import { OrderService } from '../order.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

declare let $: any;


@Component({
  selector: 'app-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.scss']
})
export class DeliveredComponent implements OnInit {
  deliveredFormSubmitted = false;
  status = "DELIVERED";
  vendorArr: any;
  orderArr: any;
  deliveredForm: FormGroup
  objj:any;
id:any;
isDisabled=true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private manageVendorService: ManageVendorService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService ,
    private modalService: NgbModal,

      private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.deliveredForm = this.formBuilder.group({
      // noOfStars:[null,Validators.required],
      noOfStars:[null],
      notes:[null,Validators.required],
      reviews:[null],
      estimatedDeliveryDate:[null],
    endDate:[null],
      startDate:[null],
      vendorName:[null],
    })
    this.getVendor();
   
  }
  get f() { return this.deliveredForm.controls };
  closed(content: any) {
   
  
    this.deliveredForm.reset({});
       
    this.deliveredFormSubmitted = false;
   
    this.modalService.open(content, { size: 'md' });
  }
  onSubmit(modal) {

    this.deliveredFormSubmitted = true;
    if (this.deliveredForm.invalid) {
      return;
    }
    // this.estimatedDeliveryDate() 
    this.orderService.getClose( this.id,this.deliveredForm.value).pipe(first()).subscribe(res => {
      this.orderArr = res.data;
      // this.router.navigate(['/delivered']);
      this.toastr.success(res.data);
    })
      modal.dismiss("cross click");
      this.getVendor();
      this.isDisabled=true;


   }
  
  getVendor() {
    this.manageVendorService.getVendor().pipe(first()).subscribe(res => {
      this.vendorArr = res.data;
      $('#delivered').DataTable().clear().destroy();
      // this.startTime();
      // this.endTime();
     this.orderService.orderPending(this.status, this.deliveredForm.value).pipe(first()).subscribe(res => {
       this.orderArr = res.data;
       this.toastr.success(res.message);
       this.spinner.hide();
       $(document).ready(function () {
         $('#delivered').DataTable({
           "iDisplayLength": 25
         });
       })
     },
     err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  onClick(order) {
 
  this.isDisabled=false;
    this.objj = order
    this.id=this.objj.customerOrderId
  
  }

  estimatedDeliveryDate() {
    let val = this.deliveredForm.value.estimatedDeliveryDate.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val[1] = val[1].split(':');
    let timeType: string = val[1][0] > 12 ? 'PM' : 'AM';
    val[1][0] = val[1][0] - (val[1][0] > 12 ? 12 : 0);
    val[1][0] = val[1][0] == 0 ? 12 : val[1][0];
    val[1] = `${val[1].join(':')} ${timeType}`;
    val[1] = val[1];
    val = val.join(' ');
    this.deliveredForm.patchValue({
      estimatedDeliveryDate: val,
    });
  }

}
