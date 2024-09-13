import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorOrderService } from '../../vendor-order.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any
@Component({
  selector: 'app-shipped-list',
  templateUrl: './shipped-list.component.html',
  styleUrls: ['./shipped-list.component.scss']
})
export class ShippedListComponent implements OnInit {
  id: any;
  shippedArr: any = [];
  // buttonText = "";
  shippedSubmitted = false;
  shippedForm: FormGroup;
  data: any = {}
  vendorId: any;
  user: any = {};



  constructor(
    private route: ActivatedRoute,
    private service: VendorOrderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.vendorId = this.user.userId;
    this.id = this.route.snapshot.params[('id')]
    this.shippedForm = this.formBuilder.group({
      id: [null],
      estimatedDeliveryDate: [null, [Validators.required]],

    })
    this.getShipped('SHIPPED')

  }
  openModal(modal: any, customerOrderId) {
    // this.buttonText = "Delivered";
    this.shippedForm.reset({});
    this.shippedSubmitted = false;
    this.id = customerOrderId
    this.modalService.open(modal, { size: 'sm' });
  }
  get f() {
    return this.shippedForm.controls;
  }
  onSubmit(modal) {
    this.shippedSubmitted = true;
    if (this.shippedForm.invalid) {
      return;
    }
    this.estimatedDeliveryDate()
    modal.dismiss('Cross click')
    this.service.deliveryUpadate(this.id, this.shippedForm.value).subscribe(res => {
      this.toastr.success(res.data);
      this.router.navigate(['/vendor/vendor-order/delivered-list'])
    })

  }
  getAll: any = [];
  getShipped(orderStatus) {
    $('#shippedTable').DataTable().clear().destroy();
    this.service.getVendor(orderStatus).subscribe(res => {
      this.getAll = res.data;
      this.shippedArr = this.getAll.filter((res: any) => {
        return res.userId == this.vendorId;
      })
      console.log(this.shippedArr);
      
      this.shippedArr.sort((a: any, b: any) => {
        if (a.customerOrderNo < b.customerOrderNo) return -1;
        if (a.customerOrderNo > b.customerOrderNo) return 1;
        return 0;
      })
      $(document).ready(function () {
        $('#shippedTable').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    })
  }
  estimatedDeliveryDate() {
    let val = this.shippedForm.value.estimatedDeliveryDate.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val[1] = val[1].split(':');
    let timeType: string = val[1][0] > 12 ? 'PM' : 'AM';
    val[1][0] = val[1][0] - (val[1][0] > 12 ? 12 : 0);
    val[1][0] = val[1][0] == 0 ? 12 : val[1][0];
    val[1] = `${val[1].join(':')} ${timeType}`;
    val[1] = val[1];
    val = val.join(' ');
    this.shippedForm.patchValue({
      estimatedDeliveryDate: val,
    });

  }
}
