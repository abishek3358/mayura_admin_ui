import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CompanySettingService } from '../../masters/company-setting/company-setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from './../invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  invoiceArr = [];
  companyAddressObj: any = {};
  invoiceObj: any = {};
  companyAddressDTOList: any = {};
  salesInvoiceDtlDTOList: any ={};
  waitingForTheResponse: boolean = false;
  numberInWords = "";
  n: any;
  a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  constructor(
    private companyDetails: CompanySettingService,
    private spinner: NgxSpinnerService,
    private InvoiceService: InvoiceService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singleid(id);
    }
    this.spinner.show();
    this.getAddress();
  }

  getAddress() {
    this.companyDetails.getcompany().pipe(first()).subscribe(res => {
      this.companyAddressObj = res.data;
     
      this.spinner.hide();
      // this.Toastr.success(res.message);
      this.waitingForTheResponse = true;
    }, err => {
      this.spinner.hide();
      this.Toastr.success(err.error.error.reason);
    })
  }
  inWords(num) {

    this.n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!this.n) return; var str = '';
    str += (this.n[1] != 0) ? (this.a[Number(this.n[1])] || this.b[this.n[1][0]] + ' ' + this.a[this.n[1][1]]) + 'crore ' : '';
    str += (this.n[2] != 0) ? (this.a[Number(this.n[2])] || this.b[this.n[2][0]] + ' ' + this.a[this.n[2][1]]) + 'lakh ' : '';
    str += (this.n[3] != 0) ? (this.a[Number(this.n[3])] || this.b[this.n[3][0]] + ' ' + this.n[this.n[3][1]]) + 'thousand ' : '';
    str += (this.n[4] != 0) ? (this.a[Number(this.n[4])] || this.b[this.n[4][0]] + ' ' + this.n[this.n[4][1]]) + 'hundred ' : '';
    str += (this.n[5] != 0) ? ((str != '') ? 'and ' : '') + (this.a[Number(this.n[5])] || this.b[this.n[5][0]] + ' ' + this.a[this.n[5][1]]) + 'only ' : '';
    return str;

  }

  singleid(id) {

    this.InvoiceService.singleViewGetInvoice(id).pipe(first()).subscribe(res => {
      this.invoiceObj = res.data;
      this.numberInWords = this.inWords(Math.round(res.data.totalAmount))

      this.spinner.hide();
      this.Toastr.success(res.message);
      // this.waitingForTheResponse = true;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
