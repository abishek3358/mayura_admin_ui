import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;
@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  cancelForm!: FormGroup;
  orderPendingArr: any = [];
  Status = 'CONFIRMED';
  view: any;
  data: any
  cancelSubmit = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.orderPending();
    this.cancelForm = this.fb.group({
      reason: [null, Validators.required],
      customerOrderId: [null]
    })
  }
  orderPending() {
    $('#pending').DataTable().clear().destroy();
    this.orderService.pending(this.Status, this.data).pipe(first()).subscribe(res => {

      $(document).ready(function () {
        $('#pending').DataTable({
          "iDisplayLength": 25
        });
      })
      this.orderPendingArr = res.data;
      console.log(this.orderPendingArr);


      this.orderPendingArr.sort((a: any, b: any) => {
        if (a.orderNo < b.orderNo) return -1;
        if (a.orderNo > b.orderNo) return 1;
        return 0;
      })
      this.toastr.success(res.message);
      this.spinner.hide();
    }
      ,
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })

  }

  cancelId: any;
  openModal(content: any, id: any) {
    console.log(id);
    this.cancelId = id;
    this.cancelSubmit = false;
    this.view = this.orderPendingArr.find(function (element) {

      return id == element.orderId;
    });

    this.modalService.open(content, { size: 'lg' });
    this.cancelForm.reset({});
  }
  get f() {
    return this.cancelForm.controls
  }
  orderCancel(modal: any) {
    this.cancelSubmit = true;
    let obj = this.cancelForm.value;
    obj.customerOrderId = this.cancelId;
    this.orderService.adminRejectedOrders(this.cancelForm.value).pipe(first()).subscribe(res => {
      console.log(res);
      this.toastr.success(res.data);
      this.cancelForm.reset({});
      modal.dismiss('Cross click')
      this.orderPending();
    }, err => {
      this.toastr.error(err.error);
    })
  }

}
