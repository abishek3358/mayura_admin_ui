import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './../masters/location.service';
import { ManageProjectService } from './../project/manage-project-form/manage-project.service';
import { ContractorService } from './../contractor-form/contractor.service';
import { SubContractWorkOrderService } from './sub-contract-work-order.service';
import { ApiService } from './../masters/unit-of-measurement/api.service';


declare let $: any;

@Component({
  selector: 'app-sub-contract-work-order-form',
  templateUrl: './sub-contract-work-order-form.component.html',
  styleUrls: ['./sub-contract-work-order-form.component.scss']
})
export class SubContractWorkOrderFormComponent implements OnInit {
  // public contentHeader: object;
  private stepper: Stepper;
  subContractWorkOrderFormsubmitted = false;
  subContractWorkOrderForm: FormGroup;
  subContractWorkOrderFormbuttonText: string = "";
  subContractWorkOrderFormObj: {};
  subContractWorkOrderArr: any = [];
  projectArr: any = [];
  ContractorArr: any = [];
  uomArr: any = [];
  projectId: any;
  contractorId: any;
  contractArr: any = [];
  itemsArr: any = [];
  id: any;
  arrLength: number;
  titleArr:any = [];
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private location: LocationService,
    private ManageProjectService: ManageProjectService,
    private ContractorService: ContractorService,
    private SubContractWorkOrderService: SubContractWorkOrderService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.stepper = new Stepper(document.querySelector('#stepper3'), {
      linear: true,
      animation: true
    });


    this.subContractWorkOrderForm = this.formBuilder.group({
      contractorId: [null, [Validators.required]],
      id: [null],
      natureOfWork: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      workOrderDate: [null, [Validators.required]],
      workOrderEndto: [null, [Validators.required]],
      workOrderNo: [null, [Validators.required]],
      workOrderStartFrom: [null, [Validators.required]],
      subContractItemDTOList: this.formBuilder.array([this.subContractItemDTOListFormGroup()], [Validators.required]),
      subContractWOEstimateDTOList: this.formBuilder.array([this.subContractWOEstimateDTOListFormGroup()
      ]),
      subTotal: [null, [Validators.required]],
      total: [0, [Validators.required]],
      igst: [0],
      cgst: [0],
      sgst: [0],
      igstPercentage: [null],
      cgstPercentage: [null],
      sgstPercentage: [null],
    });

    this.getProject();
    this.getContractor();
    this.getUom();
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.spinner.show();
      this.getSingleSubContract(id);
    }
  }
  get f() { return this.subContractWorkOrderForm.controls };
  subContractWOEstimateDTOListFormGroup() {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      total: [0, [Validators.required]],
      subContractWOEstimateDTLDTOList: this.formBuilder.array([this.subContractWOEstimateDTLDTOListFormGroup()]),
      id: [null],
      subContractWorkOrderId: [null]
    })
  }
  subContractItemDTOListFormGroup() {
    return this.formBuilder.group({
      amount: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      id: [null],
      itemName: [null],
      quantity: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      subContractWorkOrderId: [null],
      workOrderDetailsId: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      uomName: [null],


    });

  }

  get subContractItemDTOListArr(): FormArray {
    return this.subContractWorkOrderForm.get('subContractItemDTOList') as FormArray
  }

  // get subContractWOEstimateDTLDTOListArr(): FormArray {
  //   let group = this.subContractWorkOrderForm.get('subContractWOEstimateDTOList') as FormArray
  //   return group.get('subContractWOEstimateDTLDTOList') as FormArray
  // }
  get arr(): FormArray {
    return this.subContractWorkOrderForm.get('subContractWOEstimateDTOList') as FormArray;
  }
  subContractWOEstimate(i: number): FormArray {
    return this.arr.at(i).get('subContractWOEstimateDTLDTOList') as FormArray
  }
  subContractWOEstimateDTLDTOListFormGroup() {
    return this.formBuilder.group({
      // name: [null, [Validators.required]],
      name: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      uomName: [null],
      id: [null],
      noOfMember: [null, [Validators.required]],
      subContractWoEstimateId: [null],
      remarks: [null],
      length: [null, [Validators.required]],
      bredth: [null, [Validators.required]],
      depth: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
    });

  }
  itemGet() {
    this.SubContractWorkOrderService.getItem(this.subContractWorkOrderForm.value.projectId).pipe(first()).subscribe(res => {
      this.itemsArr = res.data;
    }, err => {
      this.Toastr.error(err.error.error.reason);
    });
  }
  getTitle(){
    for (let i=0;i<this.subContractItemDTOListArr.value.length;i++) {

      for(let j=0;j<this.itemsArr.length;j++) {

        if(this.subContractItemDTOListArr.value[i].workOrderDetailsId == this.itemsArr[j].id) {
          this.titleArr[i] = this.itemsArr[j].itemCode;
        }
      }
    }
  }
  titleGet(index) { 
    // alert("hi")
    for(let i=0;i<this.itemsArr.length;i++){
 
      if(this.subContractItemDTOListArr.value[index].workOrderDetailsId == this.itemsArr[i].id) {

        this.titleArr[index] = this.itemsArr[i].itemCode;

      }
     
    }
  }
  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.subContractItemDTOListArr.length; i++) {
        subTotal += this.subContractItemDTOListArr.value[i].amount;
      }
      subTotal = parseFloat(subTotal.toFixed(2));
      this.subContractWorkOrderForm.patchValue({
        subTotal: subTotal
      })
      this.taxCalculation();
    }, 1000);
  }



  calculateTotal() {
    let total = 0;
    setTimeout(() => {
      total = parseFloat(this.subContractWorkOrderForm.value.subTotal) + parseFloat(this.subContractWorkOrderForm.value.igst) + parseFloat(this.subContractWorkOrderForm.value.cgst) + parseFloat(this.subContractWorkOrderForm.value.sgst);

      total = parseFloat(total.toFixed(2))
      this.subContractWorkOrderForm.patchValue({
        total: total
      })
    }, 1000);
  }
  taxCalculation() {


    this.subContractWorkOrderForm.patchValue({
      igst: (this.subContractWorkOrderForm.value.subTotal * this.subContractWorkOrderForm.value.igstPercentage) / 100
    });

    this.subContractWorkOrderForm.patchValue({
      cgst: (this.subContractWorkOrderForm.value.subTotal * this.subContractWorkOrderForm.value.cgstPercentage) / 100
    });

    this.subContractWorkOrderForm.patchValue({
      sgst: (this.subContractWorkOrderForm.value.subTotal * this.subContractWorkOrderForm.value.sgstPercentage) / 100
    });
    this.calculateTotal();
  }


  /* Amount Calculation Function*/
  calculateAmount(index) {
    let controlArray = <FormArray>this.subContractWorkOrderForm.controls["subContractItemDTOList"];

    controlArray.controls[index].patchValue({
      amount: this.subContractItemDTOListArr.value[index].quantity * this.subContractItemDTOListArr.value[index].rate
    });


  }
  calculateQuantity(i, j) {

    let getArray = <FormArray>this.subContractWorkOrderForm.controls['subContractWOEstimateDTOList'];

    let quantityCalculation = getArray.controls[i] as FormGroup
    let quantityArr = quantityCalculation.controls['subContractWOEstimateDTLDTOList'] as FormArray;
    quantityArr.controls[j].patchValue({
      quantity: this.subContractWorkOrderForm.value.subContractWOEstimateDTOList[i].subContractWOEstimateDTLDTOList[j].length * this.subContractWorkOrderForm.value.subContractWOEstimateDTOList[i].subContractWOEstimateDTLDTOList[j].bredth * this.subContractWorkOrderForm.value.subContractWOEstimateDTOList[i].subContractWOEstimateDTLDTOList[j].depth
    })


  }

  calculatewoTotal() {
    let total = 0;
    setTimeout(() => {
      for (let i = 0; i < this.subContractItemDTOListArr.length; i++) {
        total += this.subContractItemDTOListArr.value[i].quantity;
      }
      total = parseFloat(total.toFixed(2));
      this.subContractWorkOrderForm.patchValue({
        total: total

      })


    }, 1000);
  }

  calculateFullTotal(index) {
    setTimeout(() => {
      let total = 0
      for (let i = 0; i < this.subContractWOEstimate(index).controls.length; i++) {
        total += this.subContractWOEstimate(index).value[i].quantity;
        // console.log(this.subContractWOEstimate(index).value[i].quantity);
      }

      this.arr.controls[index].patchValue({
        total: total
      })
    }, 1000)

  }
  // getname(index) {
  //   let controlArray = <FormArray>this.subContractWorkOrderForm.controls["subContractItemDTOList"];

  //   controlArray.controls[index].patchValue({
  //     name: this.subContractItemDTOListArr.value[index].subContractWorkOrderId

  //   });
  //   this.ItemsArr.push(this.subContractItemDTOListArr.value[index].subContractWorkOrderId)


  // }
  add() {
    this.subContractItemDTOListArr.push(this.subContractItemDTOListFormGroup())
  }
  addsubContract() {
    this.arr.push(this.subContractWOEstimateDTOListFormGroup())
  }
  addWo() {
    this.arr.push(this.subContractWOEstimateDTOListFormGroup());
  }
  addSubRow(i) {
    this.subContractWOEstimate(i).push(this.subContractWOEstimateDTLDTOListFormGroup());
  }




  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  getContractor() {
    this.ContractorService.getContractor().pipe(first()).subscribe(res => {
      this.ContractorArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  getUom() {
    this.apiService.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }


  deleteterm(index) {

    if (this.subContractItemDTOListArr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');

      return false;
    } else {
      this.subContractItemDTOListArr.removeAt(index);
      this.calculateSubTotal();
      // if(this.subContractWorkOrderForm.value.id){
      //   this.arr.removeAt(index);
      // }
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }


  }

  deleteWo(index) {
    if (this.arr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');

      return false;
    } else {
      this.arr.removeAt(index);
      this.calculateSubTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  deleteMainRow(i) {
    if (this.arr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.arr.removeAt(i);
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  deleteRow(i, j) {
    if (this.subContractWOEstimate(i).length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.subContractWOEstimate(i).removeAt(j);
      this.calculateFullTotal(i)
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }



  onSubmit() {
    // console.log(this.subContractWorkOrderForm.value);
    this.subContractWorkOrderFormsubmitted = true;
    if (this.subContractWorkOrderForm.invalid) {

      return;
    }
    this.subContractWorkOrderForm.value.workOrderDate = this.subContractWorkOrderForm.value.workOrderDate.day + '/' + this.subContractWorkOrderForm.value.workOrderDate.month + '/' + this.subContractWorkOrderForm.value.workOrderDate.year;
    this.subContractWorkOrderForm.value.workOrderStartFrom = this.subContractWorkOrderForm.value.workOrderStartFrom.day + '/' + this.subContractWorkOrderForm.value.workOrderStartFrom.month + '/' + this.subContractWorkOrderForm.value.workOrderStartFrom.year;
    this.subContractWorkOrderForm.value.workOrderEndto = this.subContractWorkOrderForm.value.workOrderEndto.day + '/' + this.subContractWorkOrderForm.value.workOrderEndto.month + '/' + this.subContractWorkOrderForm.value.workOrderEndto.year;

    for (let i = 0; i < this.subContractWorkOrderForm.value.subContractItemDTOList.length; i++) {
      let deliveryDate = this.subContractWorkOrderForm.value.subContractItemDTOList[i].deliveryDate
      this.subContractWorkOrderForm.value.subContractItemDTOList[i].deliveryDate = deliveryDate.day + '/' + deliveryDate.month + '/' + deliveryDate.year
    }

    this.spinner.show();
    if (this.subContractWorkOrderForm.value.id) {
      this.SubContractWorkOrderService.updateSubContract(this.subContractWorkOrderForm.value).pipe(first()).subscribe(async res => {
        this.contractArr = res.data;
        this.Toastr.success(res.data);
        this.route.navigate(['app/sub/contract']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.SubContractWorkOrderService.createSubContract(this.subContractWorkOrderForm.value).pipe(first()).subscribe(async res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/sub/contract']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }

  }
  getSingleSubContract(id) {

    this.SubContractWorkOrderService.getSingleSubContract(id).pipe(first()).subscribe(res => {

      let projectStart = new Date(res.data.workOrderDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let startDate = { day: projectStart.getDate(), month: projectStart.getMonth() + 1, year: projectStart.getFullYear() };
      let Start = new Date(res.data.workOrderStartFrom.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let start = { day: Start.getDate(), month: Start.getMonth() + 1, year: Start.getFullYear() };

      let endStart = new Date(res.data.workOrderEndto.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let EndDate = { day: endStart.getDate(), month: endStart.getMonth() + 1, year: endStart.getFullYear() };

      this.subContractItemDTOListArr.controls = [];
      for (let i = 0; i < res.data.subContractItemDTOList.length; i++) {
        this.subContractItemDTOListArr.push(this.subContractItemDTOListFormGroup());
        let tableRowDate = new Date(res.data.subContractItemDTOList[i].deliveryDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
        let deliveryDate = { day: tableRowDate.getDate(), month: tableRowDate.getMonth() + 1, year: tableRowDate.getFullYear() };
        res.data.subContractItemDTOList[i].deliveryDate = deliveryDate;
      }
      this.arrLength = res.data.subContractItemDTOList.length
      // const MappingList = <FormArray>this.subContractWorkOrderForm.controls['subContractItemDTOList']
      // for (let i = 0; i < res.data.subContractItemDTOList.length; i++) {
      //   this.subContractItemDTOListArr.push(this.subContractItemDTOListFormGroup());
      // }
      this.arr.controls = [];
      for (let i = 0; i < res.data.subContractWOEstimateDTOList.length; i++) {
        this.arr.push(this.subContractWOEstimateDTOListFormGroup());
        this.subContractWOEstimate(i).controls = [];
        // console.log(res.data.subContractWOEstimateDTOList[i].subContractWOEstimateDTLDTOList);
        for (let j = 0; j < res.data.subContractWOEstimateDTOList[i].subContractWOEstimateDTLDTOList.length; j++) {

          this.subContractWOEstimate(i).push(this.subContractWOEstimateDTLDTOListFormGroup());
        }
      }

      this.subContractWorkOrderForm.patchValue({
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        contractorId: res.data.contractorId,
        contractorName: res.data.contractorName,
        id: res.data.id,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        jobCode: res.data.jobCode,
        natureOfWork: res.data.natureOfWork,
        projectId: res.data.projectId,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        subContractItemDTOList: res.data.subContractItemDTOList,
        subContractWOEstimateDTOList: res.data.subContractWOEstimateDTOList,
        subTotal: res.data.subTotal,
        total: res.data.total,
        workOrderDate: startDate,
        workOrderEndto: EndDate,
        workOrderNo: res.data.workOrderNo,
        workOrderStartFrom: start
      });
      this.itemGet();
      setTimeout(()=>{
        this.getTitle();
      },3000)
   
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

  basicToWODetail() {
    this.subContractWorkOrderFormsubmitted = true;
    if (this.subContractWorkOrderForm.value.natureOfWork && this.subContractWorkOrderForm.value.contractorId
      && this.subContractWorkOrderForm.value.workOrderNo && this.subContractWorkOrderForm.value.projectId
      && this.subContractWorkOrderForm.value.workOrderDate && this.subContractWorkOrderForm.value.workOrderEndto
      && this.subContractWorkOrderForm.value.workOrderStartFrom) {
      this.subContractWorkOrderFormsubmitted = false;
      this.stepper.next();
    }
  }


  next() {
    this.subContractWorkOrderFormsubmitted = true;
    let controlArray = this.subContractWorkOrderForm.controls['subContractItemDTOList']
    if (controlArray.valid && this.subContractWorkOrderForm.value.subTotal && this.subContractWorkOrderForm.value.total) {
      this.subContractWorkOrderFormsubmitted = false;
      // console.log(this.subContractWorkOrderForm.value.id);
      if (this.subContractWorkOrderForm.value.id == null) {
        this.arr.controls = [];
        let controlArray = <FormArray>this.subContractWorkOrderForm.controls["subContractWOEstimateDTOList"];
        for (let i = 0; i < this.subContractItemDTOListArr.length; i++) {
          this.arr.push(this.subContractWOEstimateDTOListFormGroup());
          for (let item of this.itemsArr) {
            if (item.id == this.subContractWorkOrderForm.value.subContractItemDTOList[i].workOrderDetailsId) {
              controlArray.controls[i].patchValue({
                name: item.itemCode
              })
            }
          }

        }
        this.stepper.next();
      } else {

        if (this.arrLength < this.subContractWorkOrderForm.value.subContractItemDTOList.length) {
          let controlArray = <FormArray>this.subContractWorkOrderForm.controls["subContractWOEstimateDTOList"];
          for (let i = this.arrLength; i < this.subContractWorkOrderForm.value.subContractItemDTOList.length; i++) {
            this.arr.push(this.subContractWOEstimateDTOListFormGroup());
            // console.log("hi");
            for (let item of this.itemsArr) {
              if (item.id == this.subContractWorkOrderForm.value.subContractItemDTOList[i].workOrderDetailsId) {
                // let count = i + 1;
                controlArray.controls[i].patchValue({
                  name: item.itemCode
                })
              }
            }
          }
          this.arrLength = this.subContractWorkOrderForm.value.subContractItemDTOList.length;
        }
        this.stepper.next();
      }




      // let controlArray = <FormArray>this.subContractWorkOrderForm.controls["subContractItemDTOList"]

    }
  }

  previous() {
    this.stepper.previous();
  }


}




