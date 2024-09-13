import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountGroupService } from '../account-group/account-group.service';
import { WagesService } from '../wages/wages.service';

@Component({
  selector: 'app-wages-record-payment',
  templateUrl: './wages-record-payment.component.html',
  styleUrls: ['./wages-record-payment.component.scss']
})
export class WagesRecordPaymentComponent implements OnInit {

  paymentForm: FormGroup;
  formSubmitted = false;
  wagesDetailsObj: any = {};
  paymentMethod = false;
  accountGroupArray: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private AccountGroupService: AccountGroupService,
    private wagesService: WagesService
  ) { }

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      id: [null],
      notes: [null, [Validators.required]],
      paidWages: [null, [Validators.required]],
      paymentAccountId: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
      payrollId: [null, [Validators.required]]
    });
    if (this.route.snapshot.params['id']) {
      this.paymentForm.patchValue({
        payrollId: this.route.snapshot.params['id']
      })
      this.getSingleWages(this.route.snapshot.params['id']);
    }
    this.getAccountGroupList();
  }
  get f() {
    return this.paymentForm.controls
  }
  payMethod() {
    if (this.paymentForm.value.paymentMethod == "CHEQUE") {
      this.paymentMethod = true;
      this.paymentForm.addControl('chequeNo', this.formBuilder.control(null, Validators.required));
    } else {
      this.paymentMethod = false;
      this.paymentForm.removeControl('chequeNo');
    }
  }
  getAccountGroupList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;
      console.log(res.data);
      // console.log(this.accountGroupArray);
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    })
  }
  getSingleWages(id) {
    this.spinner.show();
    this.wagesService.singlePayrollGet(id).pipe(first()).subscribe(res => {
      this.wagesDetailsObj = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.paymentForm.invalid) {
      
      return
    }
    this.paymentForm.value.paymentDate = this.paymentForm.value.paymentDate.day + '/' + this.paymentForm.value.paymentDate.month + '/' + this.paymentForm.value.paymentDate.year
    this.spinner.show();
    this.wagesService.paymentRecord(this.paymentForm.value).pipe(first()).subscribe(res => {
      this.toastr.success(res.data);
      this.router.navigate(['app/accounts/wages']);
    }, err => {
      this.toastr.error(err.error.error.reason);
      this.spinner.hide();
    })
  }
}
