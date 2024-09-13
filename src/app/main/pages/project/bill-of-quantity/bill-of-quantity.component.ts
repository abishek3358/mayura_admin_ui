import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BillOfQuantityService } from './bill-of-quantity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../masters/unit-of-measurement/api.service';
import { MaterialService } from '../../masters/material/material.service';
import { ExecutionService } from '../../masters/execution.service';
@Component({
  selector: 'app-bill-of-quantity',
  templateUrl: './bill-of-quantity.component.html',
  styleUrls: ['./bill-of-quantity.component.scss']
})
export class BillOfQuantityComponent implements OnInit {
  boqForm: FormGroup;
  projectArr: any = [];
  WaitingFortheResponse: boolean = true;
  boqSubmitted = false;
  boqObj: any = {};
  billofObj: any = {};
  readOnly = false;
  boqArr: any = [];
  uomArr: any = [];
  materialArr: any = [];
  executionArr:any = [];
  constructor(
    private formBuilder: FormBuilder,
    private ManageProjectService: ManageProjectService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private BillOfQuantityService: BillOfQuantityService,
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private MaterialService: MaterialService,
    private executionService:ExecutionService
  ) { }

  ngOnInit(): void {
    this.boqForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      billOfQuantityDtlDTOList: this.formBuilder.array([this.formGroup()]),
      id: [null],
      notes:[null]
    });
    this.getProject();
    // this.jobCode('fgh')
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.getSingleBoq(id);
      this.readOnly = true;
    }
    this.getUom();
    this.getMaterial();
    this.getExecution();
  }
  get f() {
    return this.boqForm.controls
  }
  get boqListArr(): FormArray {
    return <FormArray>this.boqForm.get('billOfQuantityDtlDTOList')
  }
  boqExecutionLis(i): FormArray {
    return this.boqListArr.at(i).get('billOfQuantityExecutionList') as FormArray
  }
  boqSupplyList(i): FormArray {
    return this.boqListArr.at(i).get('billOfQuantitySupplyList') as FormArray
  }
  addExecutionSubRow(i) {
    this.boqExecutionLis(i).push(this.executionGroup());
  }
  addSupplySubRow(i) {
    this.boqSupplyList(i).push(this.supplyGroup());
  }
  formGroup() {
    return this.formBuilder.group({
      id: [null],
      boqId: [null],
      misc: [null, [Validators.required]],
      workOrderUomId: [null, Validators.required],
      billOfQuantityExecutionList: this.formBuilder.array([this.executionGroup()]),
      billOfQuantitySupplyList: this.formBuilder.array([this.supplyGroup()]),
      totalAmount: [null, [Validators.required]],
      totalRate: [null, [Validators.required]],
      workOrderDetailId: [null],
      supplyAmount: [null],
      executionAmount: [null, [Validators.required]],
      netAmount: [null, [Validators.required]],
      noOfQuantity: [null, [Validators.required]],
      workOrderAmount: [null, [Validators.required]],
      workOrderRate: [null, [Validators.required]],
      sacId: [null],
      serviceDescription: [null, [Validators.required]],
      miscAmount: [null, [Validators.required]],
      workOrderItemName: [null],
      workOrderUomName: [null]
    })
  }
  executionGroup() {
    return this.formBuilder.group({
      billOfQuantityDetailId: [null],
      executionId: [null, [Validators.required]],
      executionAmount: [null, [Validators.required]],
      executionQty: [null, [Validators.required]],
      executionRate: [null, [Validators.required]],
      id: [null],
      measurement: [null, Validators.required],
      uomId: [null, [Validators.required]],
      uomName: [null],
    })
  }
  supplyGroup() {
    return this.formBuilder.group({
      billOfQuantityDetailId: [null],
      id: [null],
      materialId: [null, [Validators.required]],
      measurement: [null, [Validators.required]],
      supplyAmount: [null, [Validators.required]],
      supplyQty: [null, [Validators.required]],
      supplyRate: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      materialName: [null],
      uomName: [null],
    })
  }
  getUom() {
    this.ApiService.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data
    })
  }
  getMaterial() {
    this.MaterialService.getMaterial().pipe(first()).subscribe(res => {
      this.materialArr = res.data;
    })
  }
  getExecution(){
    this.executionService._executionGet().pipe(first()).subscribe(res=>{
      this.executionArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  calculateSupplyQty(index, secondIndex) {
    this.boqSupplyList(index).controls[secondIndex].patchValue({
      supplyQty: this.boqArr[index].noOfquantity * this.boqSupplyList(index).value[secondIndex].measurement
    });
  }
  calculateExecutionQty(index, secondIndex) {
    this.boqExecutionLis(index).controls[secondIndex].patchValue({
      executionQty: this.boqArr[index].noOfquantity * this.boqExecutionLis(index).value[secondIndex].measurement
    });
  }

  calculateSupplyAmount(index, secondIndex) {
    setTimeout(() => {
      this.boqSupplyList(index).controls[secondIndex].patchValue({
        supplyAmount: this.boqSupplyList(index).value[secondIndex].supplyQty * this.boqSupplyList(index).value[secondIndex].supplyRate
      });
    }, 10)

  }
  calculateExecutionAmount(index, secondIndex) {
    setTimeout(() => {
      this.boqExecutionLis(index).controls[secondIndex].patchValue({
        executionAmount: this.boqExecutionLis(index).value[secondIndex].executionQty * this.boqExecutionLis(index).value[secondIndex].executionRate
      });
    }, 10)
  }
  calculateSupplyTotal(index) {
    let supplyTotal = 0;
    setTimeout(() => {
      for (let supply of this.boqSupplyList(index).controls) {
        supplyTotal += supply.value.supplyAmount
      }
      this.boqListArr.controls[index].patchValue({
        supplyAmount: supplyTotal
      })
    }, 100)
  }
  calculateExecutionTotal(index) {
    let executionTotal = 0;
    setTimeout(() => {
      for (let execution of this.boqExecutionLis(index).controls) {
        executionTotal += execution.value.executionAmount
      }
      this.boqListArr.controls[index].patchValue({
        executionAmount: executionTotal
      })
    }, 100)
  }
  calculateMiscAmount(index) {
    this.boqListArr.controls[index].patchValue({
      miscAmount: parseFloat((((this.boqListArr.value[index].supplyAmount + this.boqListArr.value[index].executionAmount) * this.boqListArr.value[index].misc) / 100).toFixed(2))
    })

  }
  calculateTotalRate(index) {
    this.boqListArr.controls[index].patchValue({
      totalRate: (this.boqListArr.value[index].supplyAmount + this.boqListArr.value[index].executionAmount + this.boqListArr.value[index].miscAmount) / this.boqArr[index].noOfquantity
    })
  }
  calculateTotalAmount(index) {
    this.boqListArr.controls[index].patchValue({
      totalAmount: this.boqListArr.value[index].totalRate * this.boqArr[index].noOfquantity
    })
    this.calculateNetValue(index);
  }
  calculateNetValue(index) {
    
    this.boqListArr.controls[index].patchValue({
      netAmount:  this.boqListArr.value[index].totalAmount - this.boqArr[index].amount
    })
  }


  getSingleBoq(id) {
    this.spinner.show();

    this.BillOfQuantityService.getSingleBoq(id).pipe(first()).subscribe(res => {
      this.boqObj = res.data
      this.boqListArr.controls = [];
      for (let i = 0; i < res.data.billOfQuantityDtlDTOList.length; i++) {
        this.boqListArr.push(this.formGroup());
        this.boqExecutionLis(i).controls = [];
        this.boqSupplyList(i).controls = [];
        setTimeout(() => {
          for (let j = 0; j < res.data.billOfQuantityDtlDTOList[i]?.billOfQuantityExecutionList.length; j++) {
            this.boqExecutionLis(i).push(this.executionGroup());
          }
          for (let j = 0; j < res.data.billOfQuantityDtlDTOList[i]?.billOfQuantitySupplyList.length; j++) {
            this.boqSupplyList(i).push(this.supplyGroup());
          }
        })

        // this.boqListArr.controls[i].patchValue({
        //   supplyAmount: res.data.billOfQuantityDtlDTOList[i].supplyAmount,
        //   supplyRate: res.data.billOfQuantityDtlDTOList[i].supplyRate,
        //   executionAamount: res.data.billOfQuantityDtlDTOList[i].executionAamount,
        //   totalAmount: res.data.billOfQuantityDtlDTOList[i].totalAmount,
        //   totalRate: res.data.billOfQuantityDtlDTOList[i].totalRate,
        //   executionRate: res.data.billOfQuantityDtlDTOList[i].executionRate,
        //   misc: res.data.billOfQuantityDtlDTOList[i].misc,
        //   id: res.data.billOfQuantityDtlDTOList[i].id,
        //   boqId: res.data.billOfQuantityDtlDTOList[i].boqId,
        //   workOrderDetailId: res.data.billOfQuantityDtlDTOList[i].workOrderDetailId
        // });
      }

      setTimeout(() => {
        this.boqForm.patchValue({
          billOfQuantityDtlDTOList: res.data.billOfQuantityDtlDTOList,
          projectId: res.data.projectId,
          id: res.data.id,
          notes:res.data.notes
        })
        console.log(this.boqForm.value);

      }, 100);

      // this.jobCode(res.data.projectId)
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.success(err.error.error.reason);
    })

  }

  jobCode(id) {
    this.spinner.show();
    this.ManageProjectService.getBOQ(id).pipe(first()).subscribe(res => {
      this.billofObj = res.data;
      if (!this.route.snapshot.params['id']) {
        this.boqListArr.controls = [];
      }
      this.boqArr = res.data;


      for (let i = 0; i < res.data.length; i++) {
        if (!this.route.snapshot.params['id']) {
          this.boqListArr.push(this.formGroup());
        }
        setTimeout(() => {
          this.boqListArr.controls[i].patchValue({
            noOfQuantity: res.data[i].noOfquantity,
            workOrderAmount: res.data[i].amount,
            sacId: res.data[i].sacId,
            workOrderRate: res.data[i].unitRate,
            serviceDescription: res.data[i].serviceDescription,
            workOrderUomId: res.data[i].uomId,
            workOrderDetailId: res.data[i].id,
          }, 1000);
        })

      }

      this.spinner.hide();
      // this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  add() {
    this.boqListArr.push(this.formGroup());
  }
  getProject() {
    this.BillOfQuantityService.getBoqProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      console.log(this.projectArr)
      this.spinner.hide();

      // this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  deleteRow(index) {
    if (this.boqListArr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.boqListArr.removeAt(index);
      this.calculateTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  onSubmit() {
    this.boqSubmitted = true;
    if(this.route.snapshot.params['id']) {
      for (let i = 0; i < this.boqListArr.value.length; i++) {
        this.boqListArr.controls[i].patchValue({
          serviceDescription:this.boqListArr.value[i].workOrderItemName
        })
      }
    }
   
    if (this.boqForm.invalid) {
      const invalid = [];
      const controls = this.boqListArr.controls[0] as FormGroup;
      for (const name in controls.controls) {
        if (controls.controls[name].invalid) {
          invalid.push(name);
        }
      }
console.log(invalid)
      return
    }

    this.spinner.show();

    if (this.boqForm.value.id) {
      this.BillOfQuantityService.updateBoq(this.boqForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/project/bill/of/quantity']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.BillOfQuantityService.createBoq(this.boqForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/project/bill/of/quantity']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }

  }



  // calculateAmount(index) {
  //   this.boqListArr.controls[index].patchValue({
  //     amount: this.boqForm.value.billOfQuantityDtlDTOList[index].rate * this.boqForm.value.billOfQuantityDtlDTOList[index].quantity
  //   });
  // }
  calculateTotal() {
    let total = 0;
    for (let i = 0; i < this.boqListArr.controls.length; i++) {
      total += this.boqForm.value.billOfQuantityDtlDTOList[i].totalAmount
    };
    setTimeout(() => {
      this.boqForm.patchValue({
        totalAmount: total
      })
    }, 100)


  }

}
