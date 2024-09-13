import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { InvoiceService } from '../invoice/invoice.service';
import { BillsService } from '../bill/bills.service';
import { ToastrService } from 'ngx-toastr';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
@Component({
  selector: 'app-bills-record-payment',
  templateUrl: './bills-record-payment.component.html',
  styleUrls: ['./bills-record-payment.component.scss']
})
export class BillsRecordPaymentComponent implements OnInit {

  billsPaymentForm: FormGroup;
  formSubmitted = false;
  billDetailsObj: any = {};
  accountGroupArray: any = [];
  paymentMethod = false;
  constructor(
    private formBuilder: FormBuilder,
    private InvoiceService: InvoiceService,
    private router: ActivatedRoute,
    private Spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private AccountGroupService: AccountGroupService,
    private BillsService: BillsService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.billsPaymentForm = this.formBuilder.group({
      id: [null],
      billId: [null],
      paymentAccountId: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
      notes: [null],
      paymentDue: [null]
      // chequeNo: [null,[Validators.required]]
    })
    if (this.router.snapshot.params['id']) {
      this.getDetails(this.router.snapshot.params['id']);
      this.billsPaymentForm.patchValue({
        billId: this.router.snapshot.params['id']
      })
    }
    this.getAccountGroupList();
  }
  get f() {
    return this.billsPaymentForm.controls
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.billsPaymentForm.invalid) {

      return;
    }
    this.Spinner.show();
    this.billsPaymentForm.value.paymentDate = this.billsPaymentForm.value.paymentDate.year + '/' + this.billsPaymentForm.value.paymentDate.month + '/' + this.billsPaymentForm.value.paymentDate.day
    this.BillsService.createPaymentRecord(this.billsPaymentForm.value).pipe(first()).subscribe(res => {
      this.Spinner.hide();
      this.Toastr.success(res.data);
      this.route.navigate(['app/accounts/bills']);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  payMethod() {
    if (this.billsPaymentForm.value.paymentMethod == "CHEQUE") {
      this.paymentMethod = true;
      this.billsPaymentForm.addControl('chequeNo', this.formBuilder.control(null, Validators.required));
    } else {
      this.paymentMethod = false;
      this.billsPaymentForm.removeControl('chequeNo');
    }
  }
  getAccountGroupList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;

      this.Spinner.hide();
    }, error => {
      this.Spinner.hide();
      this.Toastr.error(error);
    })
  }
  getDetails(id) {
    this.Spinner.show();
    this.BillsService.getSingleBill(id).pipe(first()).subscribe(res => {

      this.billDetailsObj = res.data;
      this.billsPaymentForm.patchValue({
        paymentDue: res.data.totalAmount
      })
      this.Spinner.hide();
    })
  }
}
