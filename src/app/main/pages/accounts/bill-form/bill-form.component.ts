import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { VendorService } from './../../vendor-form/vendor.service';
import { first } from 'rxjs/operators';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { BillsService } from '../bill/bills.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service'

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss']
})
export class BillFormComponent implements OnInit {
  billForm: FormGroup;
  billSubmitted = false;
  vendorArr: any = [];
  itemArr: any = [];
  accountGroupArray: any = [];
  projectArr: any = [];

  constructor(private FormBuilder: FormBuilder,
    private Spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private VendorService: VendorService,
    private AccountGroupService: AccountGroupService,
    private ManageProjectService: ManageProjectService,
    private BillsService: BillsService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit(): void {
    // this.Spinner.show();
    this.billForm = this.FormBuilder.group({
      vendorId: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      dueAmount: [null, [Validators.required]],
      billNumber: [null, [Validators.required]],
      referenceNumber: [null, [Validators.required]],
      billDate: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      igst: [0],
      igstPercentage: [null],
      cgst: [0],
      cgstPercentage: [null],
      sgst: [0],
      sgstPercentage: [null],
      totalAmount: [null, [Validators.required]],
      subTotal: [null, [Validators.required]],
      id: [null],
      billDtlDTOList: this.FormBuilder.array([
        this.formGroup()]),
    });
    if (this.route.snapshot.params['id']) {
      this.getSingleBill(this.route.snapshot.params['id']);
    }
    this.getVendor();
    this.getAccountGroupList();
    this.getproject();

  }

  get f() {
    return this.billForm.controls;
  }

  get billListarr(): FormArray {
    return this.billForm.get('billDtlDTOList') as FormArray
  }
  add() {
    this.billListarr.push(this.formGroup());
  }

  formGroup() {
    return this.FormBuilder.group({
      item: [null, [Validators.required]],
      billId: [null],
      id: [null],
      description: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
  }

  calculateAmount(index) {
    this.billListarr.controls[index].patchValue({
      amount: this.billListarr.value[index].quantity * this.billListarr.value[index].rate
    });
  }


  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.billListarr.length; i++) {
        subTotal += parseFloat(this.billListarr.value[i].amount);
      }


      // subTotal = parseFloat(subTotal.toFixed(2));
      this.billForm.patchValue({
        subTotal: subTotal.toFixed(2)
      })
      this.taxCalculation();
    }, 100);
  }

  calculateTotal() {
    let totalAmount = 0;
    setTimeout(() => {
      totalAmount = parseFloat(this.billForm.value.subTotal) + parseFloat(this.billForm.value.igst) + parseFloat(this.billForm.value.cgst) + parseFloat(this.billForm.value.sgst);
      totalAmount = parseFloat(totalAmount.toFixed(2));
      this.billForm.patchValue({
        totalAmount: totalAmount.toFixed(2)
      })
    }, 100);
  }
  taxCalculation() {
    this.billForm.patchValue({
      igst: ((this.billForm.value.subTotal * this.billForm.value.igstPercentage) / 100).toFixed(2),
      cgst: ((this.billForm.value.subTotal * this.billForm.value.cgstPercentage) / 100).toFixed(2),
      sgst: ((this.billForm.value.subTotal * this.billForm.value.sgstPercentage) / 100).toFixed(2)
    })
    this.calculateTotal();
  }

  onSubmit() {
    this.billSubmitted = true;
    if (this.billForm.invalid) {
      return;
    }
    this.Spinner.show();
    this.billForm.value.billDate = this.billForm.value.billDate.day + '/' + this.billForm.value.billDate.month + '/' + this.billForm.value.billDate.year;
    this.billForm.value.dueDate = this.billForm.value.dueDate.day + '/' + this.billForm.value.dueDate.month + '/' + this.billForm.value.dueDate.year;

    if (this.billForm.value.id) {
      this.BillsService.updateBill(this.billForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/accounts/bills/view/' + this.route.snapshot.params['id']]);
      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.BillsService.createBill(this.billForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.message);
        this.router.navigate(['app/accounts/bills/view/' + res.data]);
      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }


  getSingleBill(id) {
    this.Spinner.show();
    this.BillsService.getSingleBill(id).pipe(first()).subscribe(res => {

      let dueDates = new Date(res.data.dueDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let dueDate = { day: dueDates.getDate(), month: dueDates.getMonth() + 1, year: dueDates.getFullYear() };
      let billsDate = new Date(res.data.billDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let billDate = { day: billsDate.getDate(), month: billsDate.getMonth() + 1, year: billsDate.getFullYear() };

      this.billListarr.controls = [];
      for (let i = 0; i < res.data.billDtlDTOList.length; i++) {
        this.billListarr.push(this.formGroup());
      }
      this.billForm.patchValue({
        dueAmount: res.data.dueAmount,
        vendorId: res.data.vendorId,
        projectId: res.data.projectId,
        billDate: billDate,
        billNumber: res.data.billNumber,
        referenceNumber: res.data.referenceNumber,
        dueDate: dueDate,
        transactionReferenceNo: res.data.transactionReferenceNo,
        notes: res.data.notes,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        totalAmount: res.data.totalAmount,
        subTotal: res.data.subTotal,
        id: res.data.id,
        billDtlDTOList: res.data.billDtlDTOList
      });
      this.Spinner.hide();
      this.Toastr.success(res.message);
    })
  }



  getVendor() {
    this.VendorService.getVendor().pipe(first()).subscribe(res => {

      this.vendorArr = res.data;
      this.Spinner.hide();
      // this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err);
    })
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
  getproject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      this.Spinner.hide();
    }, error => {
      this.Spinner.hide();
      this.Toastr.error(error);
    })
  }

  deleteterm(index) {
    if (this.billListarr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.billListarr.removeAt(index);
      this.calculateSubTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }


}
