import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ContractorService } from '../contractor-form/contractor.service';
import { ExecutionService } from '../masters/execution.service';
import { ManageProjectService } from '../project/manage-project-form/manage-project.service';
import { SubContractorBillService } from '../sub-contractor-bill/sub-contractor-bill.service';

@Component({
  selector: 'app-sub-contractor-bill-form',
  templateUrl: './sub-contractor-bill-form.component.html',
  styleUrls: ['./sub-contractor-bill-form.component.scss']
})
export class SubContractorBillFormComponent implements OnInit {
  scBillForm: FormGroup;
  workOrderArray: any = [];
  contractorArr: any = [];
  serviceArr: any = [];
  executionArr: any = [];
  submitted = false;
  detailsObj: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private manageProjectService: ManageProjectService,
    private contractorService: ContractorService,
    private SCBillService: SubContractorBillService,
    private executionService: ExecutionService
  ) { }

  ngOnInit(): void {
    this.scBillForm = this.formBuilder.group({
      advanceAmount: [null, [Validators.required]],
      billNumber: [null, [Validators.required]],
      cgst: [null],
      cgstPercentage: [null],
      id: [null],
      igst: [null],
      igstPercentage: [null],
      netAmount: [null, [Validators.required]],
      notes: [null],
      paymentStatus: [null],
      periodFrom: [null, [Validators.required]],
      periodTo: [null, [Validators.required]],
      workOrderNo: [null, [Validators.required]],
      projectName: [null],
      referenceNumber: [null, [Validators.required]],
      scopeOfWork: [null, [Validators.required]],
      sgst: [null],
      sgstPercentage: [null],
      subContractorBillDtlList:
        this.formBuilder.array([this.formGroup()])
      ,
      subContractorId: [null, [Validators.required]],
      subContractorName: [null],
      subTotal: [null, [Validators.required]],
      tdsAmount: [null, [Validators.required]],
      tdsPercentage: [null]
    });
    // this.getWorkOrder(data);
    this.getContractorList();
    if (this.route.snapshot.params['id']) {
      this.getSingleBill(this.route.snapshot.params['id'])
    }
    console.log(this.scBillForm)
  }
  formGroup() {
    return this.formBuilder.group({
      amount: [null, [Validators.required]],
      cumulativeQty: [null, [Validators.required]],
      id: [null],
      previousQty: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      serviceDescription: [null],
      subContractorBillId: [null],
      thisBillQty: [null, [Validators.required]],
      executionId: [null, [Validators.required]],
      sacId:[null,[Validators.required]],
      sacName:[null],
      uomName:[null],
      uomId:[null]
    })
  }
  get f() {
    return this.scBillForm.controls;
  }
  get scBillArr(): FormArray {
    return this.scBillForm.get('subContractorBillDtlList') as FormArray;
  }
  getWorkOrder(data){
    this.SCBillService.getWorkOrder(data).pipe(first()).subscribe(res=>{
      this.workOrderArray = res.data;
      console.log('order',this.workOrderArray)
    })
  }
  //getWorkOrder() {
  //   this.SCBillService.getWorkOrder().pipe(first()).subscribe(res => {
  //     this.projectArr = res.data;
  //     console.log('work',this.projectArr)
  //   }, err => {
  //     this.spinner.hide();
  //     this.toastr.error(err.error.error.reason);
  //   })
  // }

  getContractorList() {
    this.contractorService.getContractor().pipe(first()).subscribe(res => {
      this.contractorArr = res.data;
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getServiceList() {
    if (this.scBillForm.value.projectId && this.scBillForm.value.subContractorId && this.scBillForm.value.periodFrom && this.scBillForm.value.periodTo) {

      let startDate = this.scBillForm.value.periodFrom.day + '/' + this.scBillForm.value.periodFrom.month + '/' + this.scBillForm.value.periodFrom.year;
      let toDate = this.scBillForm.value.periodTo.day + '/' + this.scBillForm.value.periodTo.month + '/' + this.scBillForm.value.periodTo.year
      let data = {
        periodFrom: startDate,
        periodTo: toDate,
        projectId: this.scBillForm.value.projectId,
        subContractorId: this.scBillForm.value.subContractorId
      }
      this.SCBillService.getServiceDescription(data).pipe(first()).subscribe(res => {
        this.serviceArr = res.data.projectExecutionList;
        this.scBillForm.patchValue({
          advanceAmount: res.data.advanceAmount,
        })
      })
    }
  }
  getDetails(id, index) {
    this.spinner.show();
    this.SCBillService.getDetails(this.scBillForm.value.projectId, this.scBillForm.value.subContractorId, id).pipe(first()).subscribe(res => {
      this.detailsObj['details' + index] = res.data;
      this.scBillArr.controls[index].patchValue({
        previousQty: res.data.previousQuantity,
        scopeQuantity: res.data.scopeQuantity,
        sacId:res.data.sacId,
        sacName:res.data.sacCode,
        rate:res.data.rate,
        uomName:res.data.uomName,
        uomId:res.data.uomId
      })
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getSingleBill(id) {
    this.SCBillService.scSingleGet(id).pipe(first()).subscribe(res => {
      console.log(res.data)
      this.scBillArr.controls = [];
      for(let i=0;i<res.data.subContractorBillDtlList.length;i++){
        this.scBillArr.push(this.formGroup());
      }
      let periodFrom = new Date(res.data.periodFrom.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let from = { day: periodFrom.getDate(), month: periodFrom.getMonth() + 1, year: periodFrom.getFullYear() };
      let periodTo = new Date(res.data.periodTo.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let to = { day: periodTo.getDate(), month: periodTo.getMonth() + 1, year: periodTo.getFullYear() };

      this.scBillForm.patchValue({
        advanceAmount: res.data.advanceAmount,
        billNumber: res.data.billNumber,
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        id: res.data.id,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        netAmount: res.data.netAmount,
        notes: res.data.notes,
        paymentStatus: res.data.paymentStatus,
        periodFrom: from,
        periodTo: to,
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        referenceNumber: res.data.referenceNumber,
        scopeOfWork: res.data.scopeOfWork,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        subContractorBillDtlList:res.data.subContractorBillDtlList,
        subContractorId: res.data.subContractorId,
        subContractorName: res.data.subContractorName,
        subTotal: res.data.subTotal,
        tdsAmount: res.data.tdsAmount,
        tdsPercentage: res.data.tdsPercentage
      });
      for(let i=0;i<res.data.subContractorBillDtlList.length;i++){
        this.getDetails(res.data.subContractorBillDtlList[i].executionId, i);
      }
      this.getServiceList();
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  add() {
    this.scBillArr.push(this.formGroup());
  }
  calculateCumlative(index) {
    console.log(this.scBillArr.value[index].thisBillQty ,  this.detailsObj['details' + index].thisBillQuantity)
    if (this.scBillArr.value[index].thisBillQty >  this.detailsObj['details' + index].thisBillQuantity) {
      this.scBillArr.controls[index].patchValue({
        thisBillQty: (this.scBillArr.value[index].thisBillQty / 10 | 0)
      })
      this.toastr.error("This Bill Qty Should Be Less Than Alowed Qty");
     
    }
    this.scBillArr.controls[index].patchValue({
      cumulativeQty: this.detailsObj['details' + index].previousQuantity + this.scBillArr.value[index].thisBillQty,
      amount: this.calculateAmount(index)
    })
  }
  calculateAmount(index) {
    this.calculateSubTotal();
    return this.scBillArr.value[index].thisBillQty * this.scBillArr.value[index].rate;
  }

  calculateTotal() {
    let totalAmount = 0;
    setTimeout(() => {
      totalAmount = parseFloat(this.scBillForm.value.subTotal) + parseFloat(this.scBillForm.value.igst) + parseFloat(this.scBillForm.value.cgst) + parseFloat(this.scBillForm.value.sgst) - parseFloat(this.scBillForm.value.tdsAmount) - parseFloat(this.scBillForm.value.advanceAmount);
      totalAmount = parseFloat(totalAmount.toFixed(2));
      this.scBillForm.patchValue({
        netAmount: totalAmount.toFixed(2)
      })
    }, 100);
  }
  onSubmit() {
    this.submitted = true;
    if (this.scBillForm.invalid) {
      return;
    }
    this.scBillForm.value.periodTo = this.scBillForm.value.periodTo.day + '/' + this.scBillForm.value.periodTo.month + '/' + this.scBillForm.value.periodTo.year;
    this.scBillForm.value.periodFrom = this.scBillForm.value.periodFrom.day + '/' + this.scBillForm.value.periodFrom.month + '/' + this.scBillForm.value.periodFrom.year;
    this.spinner.show();
    if (this.scBillForm.value.id) {
      this.SCBillService.scUpdate(this.scBillForm.value).pipe(first()).subscribe(res => {
        this.router.navigate(['app/sub/contractor/bill'])
        this.spinner.hide();
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    } else {
      this.SCBillService.scCreate(this.scBillForm.value).pipe(first()).subscribe(res => {
        this.router.navigate(['app/sub/contractor/bill'])
        this.spinner.hide();
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }

  }
  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.scBillArr.length; i++) {

        subTotal += parseFloat(this.scBillArr.value[i].amount);
      }
      this.scBillForm.patchValue({
        subTotal: subTotal.toFixed(2)
      })
      this.taxCalculation();
    }, 100);
  }
  taxCalculation() {
    this.scBillForm.patchValue({
      igst: ((this.scBillForm.value.subTotal * this.scBillForm.value.igstPercentage) / 100).toFixed(2),
      cgst: ((this.scBillForm.value.subTotal * this.scBillForm.value.cgstPercentage) / 100).toFixed(2),
      sgst: ((this.scBillForm.value.subTotal * this.scBillForm.value.sgstPercentage) / 100).toFixed(2),
      tdsAmount: ((this.scBillForm.value.subTotal * this.scBillForm.value.tdsPercentage) / 100).toFixed(2),
    })
    this.calculateTotal();
  }
  deleteRow(index) {
    if (this.scBillArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.scBillArr.removeAt(index);
      this.toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
}
