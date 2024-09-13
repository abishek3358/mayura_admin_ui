
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorOrderService } from '../vendor-order.service';
declare let $: any
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { validateBasis } from '@angular/flex-layout';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-allocated-order',
  templateUrl: './allocated-order.component.html',
  styleUrls: ['./allocated-order.component.scss']
})
export class AllocatedOrderComponent implements OnInit {
  allocateForm: FormGroup;
  cancelForm!: FormGroup;
  orderSubmitted = false;
  buttonText: string = "";
  statusArr: any = [];
  data: any = {}
  vendorId: any;
  // orderStatus:'SHIPPED'
  id: any
  statusObj: any = {};
  view: any;
  user: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private service: VendorOrderService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.vendorId = this.user.userId;
    console.log(this.vendorId);



    // this.id = this.route.snapshot.params['id']
    // if (this.id) {    
    // }

    this.allocateForm = this.formBuilder.group({
      id: [null],
      estimatedDeliveryDate: [null, [Validators.required]],
      // reviews:[null,[Validators.required]],
      // noOfStars:[null,[Validators.required]],
      // notes:[null,[Validators.required]],

    })
    this.cancelForm = this.formBuilder.group({
      reason: [null],
      customerOrderId: [null]
    })
    this.getAllocate('ALLOCATED')
  }
  openModal(modal: any, customerOrderId) {
    this.buttonText = "Shipped";
    this.allocateForm.reset({});
    this.orderSubmitted = false;
    this.id = customerOrderId
    this.modal.open(modal, { size: 'sm' });
  }
  get f() {
    return this.allocateForm.controls;
  }
  onSubmit(modal) {
    this.orderSubmitted = true;
    if (this.allocateForm.invalid) {
      return;
    }
    this.estimatedDeliveryDate()
    modal.dismiss('Cross click')

    this.service.shippedUpdate(this.allocateForm.value, this.id).subscribe(res => {
      this.Toastr.success(res.message);
      this.router.navigate(['/vendor/vendor-order/shippedList'])

    })

  }
  getAll: any = [];
  getAllocate(orderStatus) {
    $('#orderTable').DataTable().clear().destroy();
    this.service.getVendor(orderStatus).subscribe(res => {
      this.Toastr.success(res.message);

      this.getAll = res.data;
      this.statusArr = this.getAll.filter((res: any) => {
        return res.userId == this.vendorId;
      })

      this.statusArr.sort((a: any, b: any) => {
        if (a.customerOrderNo < b.customerOrderNo) return -1;
        if (a.customerOrderNo > b.customerOrderNo) return 1;
        return 0;
      })
      this.spinner.hide();

      //  this.statusObj = res.data
      $(document).ready(function () {
        $('#orderTable').DataTable({
          "iDisplayLength": 25
        });
      });
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }
  estimatedDeliveryDate() {
    let val = this.allocateForm.value.estimatedDeliveryDate.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val[1] = val[1].split(':');
    let timeType: string = val[1][0] > 12 ? 'PM' : 'AM';
    val[1][0] = val[1][0] - (val[1][0] > 12 ? 12 : 0);
    val[1][0] = val[1][0] == 0 ? 12 : val[1][0];
    val[1] = `${val[1].join(':')} ${timeType}`;
    val[1] = val[1];
    val = val.join(' ');
    this.allocateForm.patchValue({
      estimatedDeliveryDate: val,
    });

  }
  cancelId: any;
  myModal(content: any, id: any) {
    console.log(id);

    this.cancelId = id;
    this.view = this.statusArr.find(function (element) {

      return id == element.customerOrderId;
    });

    this.modalService.open(content, { size: 'lg' })
  }

  cancelOrder(modal: any) {
    let obj = this.cancelForm.value;
    obj.customerOrderId = this.cancelId;
    obj.reason = this.cancelForm.value.reason;
    this.service.vendorReject(this.cancelForm.value).pipe(first()).subscribe((res: any) => {
      this.Toastr.success(res.data);
      this.statusArr = this.statusArr.filter((res: any) => res.customerOrderId != this.cancelId)
      modal.dismiss('Cross click')
    })

  }

}
