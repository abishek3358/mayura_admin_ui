import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CompanySettingService } from './../masters/company-setting/company-setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SubContractWorkOrderService } from '../sub-contract-work-order-form/sub-contract-work-order.service';

@Component({
  selector: 'app-sub-contract-work-order-view',
  templateUrl: './sub-contract-work-order-view.component.html',
  styleUrls: ['./sub-contract-work-order-view.component.scss']
})
export class SubContractWorkOrderViewComponent implements OnInit {

  companyAddressObj: any = {};
  workOrderObj: any = {};
  waitingForTheResponse: boolean = false;
  percentage = false;
  subContractoWorkOrderBoqDtlList: any = [];
  numberInWords = "";
  n: any;
  a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  constructor(
    private companyDetails: CompanySettingService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private workorderservice: SubContractWorkOrderService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let id = this.router.snapshot.params['id'];
    if (id) {

      this.singleId(id);
    }
    this.spinner.show();
    this.getAddress();
    console.log('view', this.workOrderObj);


  }

  // var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  // var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  inWords(num) {
    console.clear();
console.log(num)
    this.n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!this.n) return; var str = '';
    str += (this.n[1] != 0) ? (this.a[Number(this.n[1])] || this.b[this.n[1][0]] + ' ' + this.a[this.n[1][1]]) + 'crore ' : '';
    str += (this.n[2] != 0) ? (this.a[Number(this.n[2])] || this.b[this.n[2][0]] + ' ' + this.a[this.n[2][1]]) + 'lakh ' : '';
    str += (this.n[3] != 0) ? (this.a[Number(this.n[3])] || this.b[this.n[3][0]] + ' ' + this.n[this.n[3][1]]) + 'thousand ' : '';
    str += (this.n[4] != 0) ? (this.a[Number(this.n[4])] || this.b[this.n[4][0]] + ' ' + this.n[this.n[4][1]]) + 'hundred ' : '';
    str += (this.n[5] != 0) ? ((str != '') ? 'and ' : '') + (this.a[Number(this.n[5])] || this.b[this.n[5][0]] + ' ' + this.a[this.n[5][1]]) + 'only ' : '';
    return str;

  }





  getAddress() {
    this.companyDetails.getcompany().pipe(first()).subscribe(res => {
      this.companyAddressObj = res.data;
      this.spinner.hide();
      // this.Toastr.success(res.message);
      this.waitingForTheResponse = true;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  singleId(id) {
    this.workorderservice.subContractorView(id).pipe(first()).subscribe(res => {
      this.workOrderObj = res.data;
      this.numberInWords = this.inWords(Math.round(res.data.netAmount))

      console.log('view', this.workOrderObj);
      this.spinner.hide();
      this.Toastr.success(res.message);
      // this.waitingForTheResponse = true;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
