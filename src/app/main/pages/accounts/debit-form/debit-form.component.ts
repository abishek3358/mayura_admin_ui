import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from './../../vendor-form/vendor.service';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, map } from 'rxjs/operators';
import { DebitserviceService } from '../debit/debitservice.service';
import { interval, Observable, Subject } from 'rxjs';
import { SubContractWorkOrderService } from './../../sub-contract-work-order-form/sub-contract-work-order.service';

declare let $: any;
// interface Person {
//   itemCode: string;
//   itemDescription: string;
//   id: string;
// }

@Component({
  selector: 'app-debit-form',
  templateUrl: './debit-form.component.html',
  styleUrls: ['./debit-form.component.scss']
})
export class DebitFormComponent implements OnInit {
  projectArr = [];
  vendorArr = [];
  accountGroupArray = [];
  debitForm: FormGroup;
  Submitted = false;
  itemArr: any = [];
  debitList: any;
  debitNoteDTLDTOList: any;
  titleArr: any = [];
  project: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private ManageProjectService: ManageProjectService,
    private AccountGroupService: AccountGroupService,
    private Toastr: ToastrService,
    private VendorService: VendorService,
    private router: Router,
    private DebitserviceService: DebitserviceService,
    private SubContractWorkOrderService: SubContractWorkOrderService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.debitForm = this.fb.group({
      projectId: [null, Validators.required],
      billNo: ['', Validators.required],
      transactionDate: [null, Validators.required],
      transactionReferenceNo: [null, Validators.required],
      vendorId: [null, Validators.required],
      accountGroupId: [null, Validators.required],
      notes: [null, Validators.required],
      igst: [0],
      cgst: [0],
      sgst: [0],
      igstPercentage: [null],
      cgstPercentage: [null],
      sgstPercentage: [null],
      subTotal: [null, [Validators.required]],
      total: [null, [Validators.required]],
      id: null,
      debitNoteDTLDTOList: this.fb.array([this.dataList()])
    });

    this.getProject();
    this.getVendor();
    this.getAccountGroupList();
    // this.getItem();

    let id = this.route.snapshot.params['id'];
    if (id) {
      this.singleGetDebit(id);
    }

  }

  get f() { return this.debitForm.controls; }


  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getVendor() {
    this.VendorService.getVendor().pipe(first()).subscribe(res => {
      this.vendorArr = res.data;

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getItem() {
    this.SubContractWorkOrderService.getItem(this.debitForm.value.projectId).pipe(first()).subscribe(res => {
      this.itemArr = res.data;
      if (this.project != this.debitForm.value.projectId) {
        for(let i=0; i< this.tableArrList.controls.length; i++){
          this.tableArrList.controls[i].patchValue({
            workOrderDetailsId:null
          })
          
        }
        this.project = this.debitForm.value.projectId
      }
  
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getAccountGroupList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;
    },err=>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  onSubmit() {

    this.Submitted = true;
    if (this.debitForm.invalid) {
      return;
    }
    this.spinner.show();
    this.debitForm.value.transactionDate = this.debitForm.value.transactionDate.day + '/' + this.debitForm.value.transactionDate.month + '/' + this.debitForm.value.transactionDate.year
    if (this.debitForm.value.id) {
      this.DebitserviceService.updateDebit(this.debitForm.value).pipe(first()).subscribe(res => {

        this.router.navigate(['app/accounts/debit']);
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.DebitserviceService.createDebit(this.debitForm.value).pipe(first()).subscribe(res => {
        this.router.navigate(['app/accounts/debit']);
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        // this.Toastr.error(err.error.error.reason);
      });
    }
  }

  singleGetDebit(id) {
    this.DebitserviceService.singleGetDebit(id).pipe(first()).subscribe(res => {
      let projectStart = new Date(res.data.transactionDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let startDate = { day: projectStart.getDate(), month: projectStart.getMonth() + 1, year: projectStart.getFullYear() };
      this.tableArrList.controls = [];
      for (let i = 0; i < res.data.debitNoteDTLDTOList.length; i++) {
        this.tableArrList.push(this.dataList());
      }
      this.debitForm.patchValue({
        projectId: res.data.projectId,
        billNo: res.data.billNo,
        transactionDate: startDate,
        transactionReferenceNo: res.data.transactionReferenceNo,
        vendorId: res.data.vendorId,
        accountGroupId: res.data.accountGroupId,
        notes: res.data.notes,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        total: res.data.total,
        subTotal: res.data.subTotal,
        id: res.data.id,
        debitNoteDTLDTOList: res.data.debitNoteDTLDTOList
      });
      this.project = res.data.projectId;
      if (this.debitForm.value.projectId != null) {
        this.getItem();
      }
      setTimeout(() => {
        this.getTitle();
      }, 1000);
      this.spinner.hide();
      this.Toastr.success(res.message);
    });
  }


  // getDebit(){
  //   this.DebitserviceService.getDebit().pipe(first()).subscribe(res => {
  //     this.debitNoteDTLDTOList = res.data;
  //   });
  // }
  cancelDebit() {
    this.router.navigate(['app/accounts/debit']);
  }

  get tableArrList(): FormArray {
    return this.debitForm.get('debitNoteDTLDTOList') as FormArray;
  }
  dataList() {
    return this.fb.group({
      workOrderDetailsId: [null, [Validators.required]],
      quantity: ['', [Validators.required]],
      unitRate: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      id: [null]
    });
  }
  add() {
    this.tableArrList.push(this.dataList());

  }
  calculateAmount(index) {
    const debitNoteDTLDTOList = this.debitForm.get('debitNoteDTLDTOList') as FormArray;


    debitNoteDTLDTOList.controls[index].patchValue({
      amount: this.tableArrList.value[index].quantity * this.tableArrList.value[index].unitRate
    });

  }
  getTitle(){
    for (let i=0;i<this.tableArrList.value.length;i++) {
      for(let j=0;j<this.itemArr.length;j++) {
        if(this.tableArrList.value[i].workOrderDetailsId == this.itemArr[j].id) {
          this.titleArr[i] = this.itemArr[j].serviceDescription;
        }
      }
    }
  }
  titleGet(index) { 
    for(let i=0;i<this.itemArr.length;i++){
 
      if(this.tableArrList.value[index].workOrderDetailsId == this.itemArr[i].id) {

        this.titleArr[index] = this.itemArr[i].serviceDescription;

      }
     
    }
  }
  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.tableArrList.length; i++) {
        subTotal += this.tableArrList.value[i].amount;
      }

      this.debitForm.patchValue({
        subTotal: subTotal.toFixed(2)
      });
      this.taxCalculation();
    }, 1000);


  }

  calculateTotal() {
    let total = 0;
    setTimeout(() => {
      total = parseFloat(this.debitForm.value.subTotal) + parseFloat(this.debitForm.value.igst) + parseFloat(this.debitForm.value.cgst) + parseFloat(this.debitForm.value.sgst);


      this.debitForm.patchValue({
        total: total.toFixed(2)
      });
    }, 1000);
  }
  taxCalculation() {
    this.debitForm.patchValue({
      igst: ((this.debitForm.value.subTotal * this.debitForm.value.igstPercentage) / 100).toFixed(2),

      cgst: ((this.debitForm.value.subTotal * this.debitForm.value.cgstPercentage) / 100).toFixed(2),

      sgst: ((this.debitForm.value.subTotal * this.debitForm.value.sgstPercentage) / 100).toFixed(2)
    });
    this.calculateTotal();

  }
  deleteRow(index) {
    if (this.tableArrList.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');

      return false;
    } else {
      this.tableArrList.removeAt(index);
      this.calculateSubTotal()
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
}
