import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { VendorOrderService } from '../../vendor-orders/vendor-order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.scss']
})
export class CancelledComponent implements OnInit {
  cancelForm!: FormGroup;
  orderPendingArr: any = [];
  status = "CANCELLED";
  data: any;
  cancelArr: any;

  constructor(
    private orderService: OrderService,
    private vendorService: VendorOrderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.getCancelledOrder('REJECTED');
    this.cancelForm = this.fb.group({
      reason: [null],
      customerOrderId: [null]
    })
  }
  getCancelledOrder(status: any) {
    $('#cancel').DataTable().clear().destroy();
    this.vendorService.getVendor(status).pipe(first()).subscribe((res: any) => {

      this.cancelArr = res.data;
      console.log(this.cancelArr);

      $(document).ready(function () {
        $('#cancel').DataTable({
          "iDisplayLength": 25
        })
      });
    })
  }

  cancelId: any;
  view: any;
  openModal(content: any, id: any) {
    console.log(id);
    this.cancelId = id;
    this.view = this.orderPendingArr.find(function (element) {

      return id == element.orderId;
    });

    this.modalService.open(content, { size: 'lg' });
    this.cancelForm.reset({});
  }
  orderCancel(modal: any) {
    let obj = this.cancelForm.value;
    obj.customerOrderId = this.cancelId;
    this.orderService.adminRejectedOrders(this.cancelForm.value).pipe(first()).subscribe(res => {
      this.cancelArr = this.cancelArr.filter((res: any) => res.customerOrderId !== this.cancelId);
      this.toastr.success(res.data);
      this.cancelForm.reset({});
      modal.dismiss('Cross click')
      //this.orderPending();
    }, err => {
      this.toastr.error(err.error);
    })
  }
}

