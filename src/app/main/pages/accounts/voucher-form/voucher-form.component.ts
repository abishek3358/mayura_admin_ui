
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from './../../vendor-form/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { first, map } from 'rxjs/operators';
import { ManageProjectService } from '../../../pages/project/manage-project-form/manage-project.service';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { LocationService } from '../../../pages/masters/location.service';
import { interval, Observable, Subject } from 'rxjs';
import { VoucherService } from '../voucher/voucher.service';
import { SubContractWorkOrderService } from './../../sub-contract-work-order-form/sub-contract-work-order.service';


declare let $: any;

@Component({
  selector: 'app-voucher-form',
  templateUrl: './voucher-form.component.html',
  styleUrls: ['./voucher-form.component.scss']
})
export class VoucherFormComponent implements OnInit {
  voucherForm: FormGroup;
  voucherFormSubmitted = false;
  projectArr: any = [];
  vendorArr: any = [];
  accountGroupArray: any = [];
  voucherlistArr: any = [];
  voucherArr: any = [];
  paymentMode: any;
  chequecard = false;
  personalObj: any = {};
  itemArr: any = [];
  titleArr: any = [];
  project: any;
  constructor(private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private VendorService: VendorService,
    private Toastr: ToastrService,
    private route: Router,
    private VoucherService: VoucherService,
    private Spinner: NgxSpinnerService,
    private ManageProjectService: ManageProjectService,
    private AccountGroupService: AccountGroupService,
    private SubContractWorkOrderService: SubContractWorkOrderService) { }

  ngOnInit(): void {
    this.voucherForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      // billNo: [null, [Validators.required]],
      date: [null, [Validators.required]],
      voucherNo: [null, [Validators.required]],
      vendorId: [null, [Validators.required]],
      accountGroupId:[null,[Validators.required]],
      accountType: [null, [Validators.required]],
      paymentMode: [null, [Validators.required]],
      // chequeNo: [null, [Validators.required]],
      referenceNo: [null, [Validators.required]],
      igst: [null],
      igstPercentage: [null],
      cgst: [null],
      cgstPercentage: [null],
      sgst: [null],
      sgstPercentage: [null],
      subTotal: [null, [Validators.required]],
      totalAmount: [null, [Validators.required]],
      id: [null],
      voucherDtlDTOList: this.formBuilder.array([
        this.formGroup()
      ]),
    });
    this.getVendor();
    this.getProject();
    this.getAccountGroup();
    if (this.ActivatedRoute.snapshot.params['id']) {
      this.getSingleVoucher(this.ActivatedRoute.snapshot.params['id']);
    }
  }

  // selectTransport(event){
  //   this.paymentMode = event;
  //   if (this.paymentMode == 'CHEQUE') {
  //     this.voucherForm.addControl('chequeNo', this.formBuilder.control('', Validators.required));
  //   }
  //   if (this.paymentMode == 'CASH') {
  //     this.voucherForm.removeControl('chequeNo');
  //   }
  // }

  // selectLocation() {
  //   if (this.voucherForm.value.paymentMode == 'CHEQUE') {
  //     this.chequecard = true;
  //   } else {
  //     this.chequecard = false;
  //   }
  // }

  getItem() {
    this.SubContractWorkOrderService.getItem(this.voucherForm.value.projectId).pipe(first()).subscribe(res => {
      this.itemArr = res.data;
      if (this.project != this.voucherForm.value.projectId) {
        for( let i=0; i< this.voucheritemListarr.controls.length; i++){
          this.voucheritemListarr.controls[i].patchValue({
            itemDetails:null
          })
           this.project = this.voucherForm.value.projectId

        }
        
      }
    })
  }
  getTitle(){
    for (let i=0;i<this.voucheritemListarr.value.length;i++) {
      for(let j=0;j<this.itemArr.length;j++) {
        if(this.voucheritemListarr.value[i].itemDetails == this.itemArr[j].id) {
          this.titleArr[i] = this.itemArr[j].serviceDescription;
        }
      }
    }
  }
  titleGet(index) { 
    for(let i=0;i<this.itemArr.length;i++){
      if(this.voucheritemListarr.value[index].itemDetails == this.itemArr[i].id) {
        this.titleArr[index] = this.itemArr[i].serviceDescription;
      }
    }
  }


  getSingleVoucher(id) {
    this.VoucherService.getSingleVoucher(id).pipe(first()).subscribe(res => {
      this.voucherArr = res.data;

      let delivery = new Date(res.data.date.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let date = { day: delivery.getDate(), month: delivery.getMonth() + 1, year: delivery.getFullYear() };

      // if (this.voucherArr.paymentMode == 'CHEQUE') {
      //   this.chequecard = true;
      // } else {
      //   this.chequecard = false;
      // }
      this.voucheritemListarr.controls = [];
      for (let i = 0; i < res.data.voucherDtlDTOList.length; i++) {
        // console.log("hi")
        this.voucheritemListarr.push(this.formGroup());
      }
      
      // console.log(this.voucherForm)

      this.voucherForm.patchValue({
        accountType: res.data.accountType,
        accountGroupId:res.data.accountGroupId,
        id: res.data.id,
        // chequeNo: res.data.chequeNo,
        jobCode: res.data.jobCode,
        date: date,
        paymentMode: res.data.paymentMode,
        projectId: res.data.projectId,
        referenceNo: res.data.referenceNo,
        vendorId: res.data.vendorId,
        cgst: res.data.cgst,
        voucherDtlDTOList: res.data.voucherDtlDTOList,
        cgstPercentage: res.data.cgstPercentage,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        subTotal: res.data.subTotal,
        totalAmount: res.data.totalAmount,
        voucherNo: res.data.voucherNo,
      });
     this.project = res.data.projectId;
      if (this.voucherForm.value != null) {
        this.getItem();
      }
      setTimeout(() => {
        this.getTitle();
      }, 1000);
      // this.calculateSubTotal();
      this.Spinner.hide();
      this.Toastr.success(res.message)
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
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
  getAccountGroup() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;
      this.Spinner.hide();
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  getProject() {
    $('#manage-table').DataTable().clear().destroy();

    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      $(document).ready(function () {
        $('#manage-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.Spinner.hide();
      // this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err);
    });
  }
  /* Amount Calculation Function*/
  calculateAmount(index) {
    let controlArray = <FormArray>this.voucherForm.controls["voucherDtlDTOList"];
    // console.log(controlArray);
    controlArray.controls[index].patchValue({
      amount: this.voucheritemListarr.value[index].quantity * this.voucheritemListarr.value[index].rate
    });
    // console.log(this.voucheritemListarr.value[index].quantity);
    // console.log(this.voucheritemListarr.value[index].rate);

  }

  taxCalculation() {
    this.voucherForm.patchValue({
      igst: ((this.voucherForm.value.subTotal * this.voucherForm.value.igstPercentage) / 100).toFixed(2),
      cgst: ((this.voucherForm.value.subTotal * this.voucherForm.value.cgstPercentage) / 100).toFixed(2),
      sgst: ((this.voucherForm.value.subTotal * this.voucherForm.value.sgstPercentage) / 100).toFixed(2)
    });
    this.calculateTotal();
  }
  calculateTotal() {
    // console.log(typeof(this.voucherForm.value.subTotal) , typeof(this.voucherForm.value.igst) , typeof(this.voucherForm.value.cgst) , typeof(this.voucherForm.value.sgst));
    let total = (parseFloat(this.voucherForm.value.subTotal) + parseFloat(this.voucherForm.value.igst) + parseFloat(this.voucherForm.value.cgst) + parseFloat(this.voucherForm.value.sgst)).toFixed(2);
    // total = parseFloat(total).toFixed(2);
    this.voucherForm.patchValue({
      totalAmount: total
    })
  }
  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.voucheritemListarr.length; i++) {
        subTotal += this.voucheritemListarr.value[i].amount;
      };
      this.voucherForm.patchValue({
        subTotal: subTotal.toFixed(2)
      })
      this.taxCalculation();
    }, 100);
  }


  get f() {
    return this.voucherForm.controls;
  }

  get voucheritemListarr(): FormArray {
    return this.voucherForm.get('voucherDtlDTOList') as FormArray
  }

  add() {
    this.voucheritemListarr.push(this.formGroup());
  }

  onSubmit() {
    this.voucherFormSubmitted = true;
    if (this.voucherForm.invalid) {
      return;
    }
    // if (this.voucherForm.value.paymentMode === "CASH") {
    //   this.voucherForm.value.chequeNo = null;
    //   this.voucherForm.value.paymentMode = false;
    // } else {
    //   this.voucherForm.value.paymentMode = true;
    // }
    // console.log(this.voucherForm.value);
    this.Spinner.show();
    this.voucherForm.value.date = this.voucherForm.value.date.day + '/' + this.voucherForm.
      value.date.month + '/' + this.voucherForm.value.date.year;
    if (this.voucherForm.value.id) {
      this.VoucherService.updateVoucher(this.voucherForm.value).pipe(first()).subscribe(res => {
        // this.route.navigate(['app/project/purchase/order']);
        this.Toastr.success(res.data);
        this.route.navigate(['app/accounts/voucher']);
      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.VoucherService.createVoucher(this.voucherForm.value).pipe(first()).subscribe(async res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/accounts/voucher']);

      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }



  deleteterm(index) {
    if (this.voucheritemListarr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.voucheritemListarr.removeAt(index);
      this.calculateSubTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }

  formGroup() {
    return this.formBuilder.group({
      itemDetails: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      id: [null],
      amount: [null, [Validators.required]],
    });
  }


}
