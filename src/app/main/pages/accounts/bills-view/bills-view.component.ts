import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CompanySettingService } from '../../masters/company-setting/company-setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BillsService } from '../bill/bills.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bills-view',
  templateUrl: './bills-view.component.html',
  styleUrls: ['./bills-view.component.scss']
})
export class BillsViewComponent implements OnInit {
  waitingForTheResponse: boolean = false;
  companyAddressObj: any = {};
  billsobj: any = {};
  constructor(private CompanySettingService: CompanySettingService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private BillsService: BillsService,
    private route: ActivatedRoute,
    private Router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getAddress();
    this.getBill(this.route.snapshot.params['id']);
  }

  getAddress() {
    this.CompanySettingService.getcompany().pipe(first()).subscribe(res => {
      this.companyAddressObj = res.data;
      this.spinner.hide();
      this.waitingForTheResponse = true;

    }, err => {
      this.spinner.hide();
      this.Toastr.success(err.error.error.reason);
    })
  }

  getBill(id) {
    this.BillsService.getSingleBill(id).pipe(first()).subscribe(res => {
      this.billsobj = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}

