import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceService } from '../invoice/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-invoice-record-payment',
  templateUrl: './invoice-record-payment.component.html',
  styleUrls: ['./invoice-record-payment.component.scss']
})
export class InvoiceRecordPaymentComponent implements OnInit {
  invoicePaymentForm: FormGroup;
  formSubmitted = false;
  invoiceDetailsObj: any = {};
  paymentMethod = false;
  accountGroupArray: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private InvoiceService: InvoiceService,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private AccountGroupService: AccountGroupService,
    private Toastr: ToastrService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.invoicePaymentForm = this.formBuilder.group({
      id: [null],
      salesInvoiceId: [null, [Validators.required]],
      paymentAccountId: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
      notes: [null],
      paymentDue: [null],
      receivedAmount:[null,[Validators.required]]
      // chequeNo: [null,[Validators.required]]
    })
    if (this.router.snapshot.params['id']) {
      this.getDetails(this.router.snapshot.params['id']);
      this.invoicePaymentForm.patchValue({
        salesInvoiceId: this.router.snapshot.params['id']
      })
    }
    this.getAccountGroupList();
  }
  get f() {
    return this.invoicePaymentForm.controls
  }
  getDetails(id) {
    this.spinner.show();
    this.InvoiceService.singleGetInvoice(id).pipe(first()).subscribe(res => {

      this.invoiceDetailsObj = res.data;
      this.invoicePaymentForm.patchValue({
        receivedAmount: res.data.totalAmount
      })
      this.spinner.hide();
    })
  }
  payMethod() {
    if (this.invoicePaymentForm.value.paymentMethod == "CHEQUE") {
      this.paymentMethod = true;
      this.invoicePaymentForm.addControl('chequeNo', this.formBuilder.control(null, Validators.required));
    } else {
      this.paymentMethod = false;
      this.invoicePaymentForm.removeControl('chequeNo');
    }
  }
  getAccountGroupList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;
      console.log(res.data);
      // console.log(this.accountGroupArray);
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.invoicePaymentForm.invalid) {

      return;
    }
    // this.invoicePaymentForm.patchValue({
    this.invoicePaymentForm.value.paymentDate = this.invoicePaymentForm.value.paymentDate.year + '/' + this.invoicePaymentForm.value.paymentDate.month + '/' + this.invoicePaymentForm.value.paymentDate.day
    // })
    this.spinner.show();
    this.InvoiceService.createPaymentRecord(this.invoicePaymentForm.value).pipe(first()).subscribe(res => {
      this.spinner.hide();
      this.Toastr.success(res.data);
      this.route.navigate(['app/accounts/invoice']);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
    // alert("submited");
  }

}
