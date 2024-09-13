import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ContractorService } from '../contractor-form/contractor.service';
import { SacCodeService } from '../masters/sac-code/sac-code.service';
import { ApiService } from '../masters/unit-of-measurement/api.service';
import { ManageProjectService } from '../project/manage-project-form/manage-project.service';
import { SubContractorBoqService } from './sub-contractor-boq.service';

@Component({
  selector: 'app-sub-contractor-boq',
  templateUrl: './sub-contractor-boq.component.html',
  styleUrls: ['./sub-contractor-boq.component.scss']
})
export class SubContractorBoqComponent implements OnInit {
  subContractorBoqForm: FormGroup;
  uomArr: any = [];
  projectArr: any = [];
  contractorArr: any = [];
  submitted = false;
  sacArr: any = [];
  WaitingFortheResponse: boolean = false;
  serviceDescriptionObj: any = {};
  serviceTitle: any = [];
  sacList: any = []
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private uomService: ApiService,
    private manageProjectService: ManageProjectService,
    private contractorService: ContractorService,
    private SubContractorBoqService: SubContractorBoqService,
    private route: ActivatedRoute,
    private sacService: SacCodeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subContractorBoqForm = this.formBuilder.group({
      cgst: [null],
      cgstPer: [null],
      contractorId: [null, [Validators.required]],
      contractorName: [null],
      id: [null],
      igst: [null],
      igstPer: [null],
      jobCode: [null],
      netTotal: [null, [Validators.required]],
      notes: [null],
      projectId: [null, [Validators.required]],
      projectName: [null],
      sgst: [null],
      sgstPer: [null],
      subTotal: [null, [Validators.required]],
      subContractorBoqCode: [null , [Validators.required]],
      subContractorBoqDtlList: this.formBuilder.array([this.subContractorBoqDtlListFormGroup()])
    });
    this.getProject();
    this.getUom();
    this.getcontractor();
    if (this.route.snapshot.params['id']) {
      this.getSingleBoq(this.route.snapshot.params['id']);
    }
    this.getSac();
  }
  subContractorBoqDtlListFormGroup() {
    return this.formBuilder.group({
      amount: [null, [Validators.required]],
      description: [null],
      executionId: [null, [Validators.required]],
      id: [null],
      itemDescription: [null],
      quantity: [null, [Validators.required]],
      sacCode: [null],
      sacId: [null, [Validators.required]],
      subContractorBoqId: [null],
      unitRate: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      uomName: [null],

    })
  }
  get f() {
    return this.subContractorBoqForm.controls
  }
  get subContractorBoqDtlListArr() {
    return this.subContractorBoqForm.get("subContractorBoqDtlList") as FormArray
  }
  add() {
    this.subContractorBoqDtlListArr.push(this.subContractorBoqDtlListFormGroup());
  }
  getSac() {
    this.sacService.getSacCode().pipe(first()).subscribe(res => {
      this.sacList = res.data
    })
  }
  getProject() {
    this.manageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data
    })
  }
  getUom() {
    this.uomService.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data;
    })
  }
  getcontractor() {
    this.contractorService.getContractor().pipe(first()).subscribe(res => {
      this.contractorArr = res.data
    })
  }

  fetch(id) {
    this.spinner.show();
    this.SubContractorBoqService.getSacBoq(id).pipe(first()).subscribe(res => {
      this.WaitingFortheResponse = true;
      this.sacArr = res.data
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason)
    });
  }
  getSingleBoq(id) {
    this.SubContractorBoqService.getSingleSCBoq(id).pipe(first()).subscribe(res => {
      console.log(res.data);
      this.WaitingFortheResponse = true;
      this.subContractorBoqDtlListArr.controls = [];
      for (let i = 0; i < res.data.subContractorBoqDtlList.length; i++) {
        this.subContractorBoqDtlListArr.push(this.subContractorBoqDtlListFormGroup());

        // this.getExcutionDescription(res.data.subContractorBoqDtlList[i].executionId, i);
      }
      this.subContractorBoqForm.patchValue({
        executionId: res.data.executionId,
        cgst: res.data.cgst,
        cgstPer: res.data.cgstPer,
        contractorId: res.data.contractorId,
        contractorName: res.data.contractorName,
        id: res.data.id,
        igst: res.data.igst,
        igstPer: res.data.igstPer,
        jobCode: res.data.jobCode,
        netTotal: res.data.netTotal,
        notes: res.data.notes,
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        sgst: res.data.sgst,
        sgstPer: res.data.sgstPer,
        subTotal: res.data.subTotal,
        subContractorBoqCode: res.data.subContractorBoqCode,
        subContractorBoqDtlList: res.data.subContractorBoqDtlList
      });
      for (let i = 0; i < res.data.subContractorBoqDtlList.length; i++) {
        this.getServiceDescription(res.data.subContractorBoqDtlList[i].executionId, i);
      }
      this.fetch(res.data.projectId);
      this.getProject();
      this.toastr.success(res.message);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason)
    });
  }
  getServiceDescription(id, index) {
    this.SubContractorBoqService.getDescription(id, this.subContractorBoqForm.value.projectId).pipe(first()).subscribe(res => {
      // this.serviceDescriptionObj['service' + index] = res.data;
      this.serviceDescriptionObj['excution' + index] = res.data;
      this.subContractorBoqDtlListArr.controls[index].patchValue({
        uomId: this.serviceDescriptionObj['excution' + index].executionUomId
      })
    })

  }
  // getExcutionDescription(id, index) {
  //   this.SubContractorBoqService.getExcutionDescription(id).pipe(first()).subscribe(res => {
  //     this.serviceDescriptionObj['excution' + index] = res.data;
  //     console.clear();
  //     console.log(res.data)
  //     console.log(this.serviceDescriptionObj);
  //   })
  // }
  rateAndQtyAlert(index) {
    if (this.subContractorBoqDtlListArr.value[index].unitRate > this.serviceDescriptionObj['excution' + index].executionRate) {
      this.subContractorBoqDtlListArr.controls[index].patchValue({
        unitRate: (this.subContractorBoqDtlListArr.value[index].unitRate / 10 | 0)
      })
      this.toastr.error("Excution Rate Should Be Less Than Alowed Rate");
      this.calculateTotal(index);
    }
    if (this.subContractorBoqDtlListArr.value[index].quantity > this.serviceDescriptionObj['excution' + index].executionQty) {
      this.toastr.error("Excution Quantity Should Be Less Than Alowed Quantity");
      this.subContractorBoqDtlListArr.controls[index].patchValue({
        quantity: (this.subContractorBoqDtlListArr.value[index].quantity / 10 | 0)
      })
      this.calculateTotal(index);
    }
  }
  calculateTotal(index) {
    this.subContractorBoqDtlListArr.controls[index].patchValue({
      amount: this.subContractorBoqDtlListArr.value[index].unitRate * this.subContractorBoqDtlListArr.value[index].quantity
    })
    this.calculateSubTotal();
    this.rateAndQtyAlert(index);
  }
  calculateSubTotal() {
    let total = 0;
    for (let subTotal of this.subContractorBoqDtlListArr.value) {
      total += subTotal.amount;
    }
    this.subContractorBoqForm.patchValue({
      subTotal: total
    })
  }
  deleteRow(index) {
    if (this.subContractorBoqDtlListArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.subContractorBoqDtlListArr.removeAt(index);
      this.calculateSubTotal();
      this.toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  calculateEntireTotal() {
    this.subContractorBoqForm.patchValue({
      netTotal: parseFloat(this.subContractorBoqForm.value.subTotal) + parseFloat(this.subContractorBoqForm.value.igst) + parseFloat(this.subContractorBoqForm.value.sgst) + parseFloat(this.subContractorBoqForm.value.cgst)
    })
  }
  taxCalculation() {
    this.subContractorBoqForm.patchValue({
      igst: ((this.subContractorBoqForm.value.subTotal * this.subContractorBoqForm.value.igstPer) / 100).toFixed(2),

      cgst: ((this.subContractorBoqForm.value.subTotal * this.subContractorBoqForm.value.cgstPer) / 100).toFixed(2),

      sgst: ((this.subContractorBoqForm.value.subTotal * this.subContractorBoqForm.value.sgstPer) / 100).toFixed(2)
    });
    this.calculateEntireTotal();
  }
  onSubmit() {
    this.submitted = true;
    if (this.subContractorBoqForm.invalid) {
      console.log(this.subContractorBoqForm.value)
      return;
    }
    this.spinner.show();
    if (this.subContractorBoqForm.value.id) {
      this.SubContractorBoqService.updateSCBoq(this.subContractorBoqForm.value).pipe(first()).subscribe(res => {
        this.spinner.hide();
        this.router.navigate(['app/sub/contractor/boq']);
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason)
      });
    } else {
      this.SubContractorBoqService.createSCBoq(this.subContractorBoqForm.value).pipe(first()).subscribe(res => {
        this.spinner.hide();
        this.router.navigate(['app/sub/contractor/boq']);
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason)
      });
    }

  }


}
