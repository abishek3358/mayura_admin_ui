import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOrderService } from './work-order.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any;
@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit {

  workArr: any = [];

  constructor(
    private router: Router,
    private WorkOrderService: WorkOrderService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getWorkOrder();
  }
  addform() {
    this.Toastr.warning('Form is Not Ready');

  }

  getWorkOrder() {
    this.spinner.show();
    $('#workTable').DataTable().clear().destroy();
    this.WorkOrderService.getWorkOrderList().pipe(first()).subscribe(res => {
      this.workArr = res.data;
      $(document).ready(function () {
        $('#workTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    })

  }

}
