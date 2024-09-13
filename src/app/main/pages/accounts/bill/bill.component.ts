import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { BillsService } from './bills.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare let $: any;
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  billArr: any = [];
  BillId = "";
  constructor(
    private Toastr: ToastrService,
    private Spinner: NgxSpinnerService,
    private BillsService: BillsService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.getBill();
  }


  getBill() {
    this.Spinner.show();
    $('#billTable').DataTable().clear().destroy();
    this.BillsService.getBill().pipe(first()).subscribe(res => {
      this.billArr = res.data;
      $(document).ready(function () {
        $('#billTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.Spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  viewBill(id) {
    this.router.navigate(['app/accounts/bills/view' + '/' + id]);
  }

  editBill(id) {
    this.Spinner.show();
    this.router.navigate(['app/accounts/bills' + '/' + id]);
  }
  recordPayment(id) {
    this.router.navigate(['app/accounts/bills/record/payment/' + id])
  }
  deleteConfirmation(modal,billData){
    this.modalService.open(modal,{size:'md'});
    this.BillId = billData.id;
  }

  deleteBill(modal) {
    this.Spinner.show();
    this.BillsService.deleteBill(this.BillId).pipe(first()).subscribe(res => {
      this.getBill();
      modal.dismiss("cross click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }



}
