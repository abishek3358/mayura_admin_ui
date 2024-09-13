import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { VendorService } from '../vendor-form/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  vendorArr: any = [];
  constructor(
    private VendorService: VendorService,
    private Toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getVendor();
  }

  getVendor() {
    $('#vendorTable').DataTable().clear().destroy();

    this.VendorService.getVendor().pipe(first()).subscribe(res => {

      this.vendorArr = res.data;
      $(document).ready(function () {
        $('#vendorTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  editvendor(id) {
    this.spinner.show();
    this.router.navigate(['app/vendor' + '/' + id]);
  }
  deletevendor(id) {
    this.spinner.show();
    this.VendorService.deleteVendor(id).pipe(first()).subscribe(res => {
      this.getVendor();
      this.Toastr.success(res.data);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
