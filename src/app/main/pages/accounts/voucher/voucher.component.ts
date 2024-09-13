import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { VoucherService } from "../voucher/voucher.service";
import { first } from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare let $: any;

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {


  voucherArr: any = [];
  id: any;
  voucherId:"";

  constructor(
    private router: Router, private Toastr: ToastrService,
    private Spinner: NgxSpinnerService,
    private VoucherService: VoucherService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.Spinner.show();
    this.getVoucher();
console.log(this)
  }

  getVoucher() {
    $('#voucher-table').DataTable().clear().destroy();

    this.VoucherService.getVoucher().pipe(first()).subscribe(res => {
      this.voucherArr = res.data;
      $(document).ready(function () {
        $('#voucher-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.Spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err);
    });
  }


  editVoucher(id) {
    this.Spinner.show();
    this.router.navigate(['app/accounts/voucher/' + id]);
  }
  deleteConfirmation(modal,voucher){
    this.modalService.open( modal, { size: 'md' });
    this.voucherId = voucher.id;
  }
  delete(modal) {

    this.Spinner.show();
    this.VoucherService.deleteVoucher(this.voucherId).pipe(first()).subscribe(res => {
      this.getVoucher();
      modal.dismiss("cross click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

}



