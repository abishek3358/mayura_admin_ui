import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { DatePipe } from '@angular/common';
import { DateFormatterService } from '../../date-formatter.service';
import { VendorService } from './../../vendor-form/vendor.service';
import { first, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationService } from '../../masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageProjectService } from '../manage-project-form/manage-project.service';
import { CompanySettingService } from '../../masters/company-setting/company-setting.service';
import { interval, Observable, Subject } from 'rxjs';
import { PurchaseOrderService } from './purchase-order.service';
import { ApiService } from '../../masters/unit-of-measurement/api.service';
import { SacCodeService } from '../../masters/sac-code/sac-code.service';
import { SubContractWorkOrderService } from './../../sub-contract-work-order-form/sub-contract-work-order.service';

declare let $: any;

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss']
})
export class PurchaseOrderFormComponent implements OnInit {

  purchaseOrderForm: FormGroup;
  purchaseSubmitted = false;
  projectArr: any = [];
  vendorArr: any = [];
  vendorAddressObj: any = {}
  vendorAndProjectIdSelected: boolean = false;
  projectDetails: any = {};
  officeDetails: any = {};
  sacArr: any = [];
  uomArr: any = [];
  purchaseOrderArr: any = [];
  itemArr: any = [];
  titleArr: any = [];
  serviceDescriptionObj: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private VendorService: VendorService,
    private _dateFormatterService: DateFormatterService,
    private spinner: NgxSpinnerService,
    private LocationService: LocationService,
    private Toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private ManageProjectService: ManageProjectService,
    private CompanySettingService: CompanySettingService,
    private PurchaseOrderService: PurchaseOrderService,
    private ApiService: ApiService,
    private SacCodeService: SacCodeService,
    private SubContractWorkOrderService: SubContractWorkOrderService
  ) {

  }

  ngOnInit(): void {
    this.purchaseOrderForm = this.formBuilder.group({
      companyId: [null],
      deliveryDate: [null, [Validators.required]],
      id: [null],
      // liquidateddamagesforDelay: [null, [Validators.required]],
      materialAdvance: [null, [Validators.required]],
      modeofTranspoat: [null, Validators.required],
      performanceGuarantee: [null, [Validators.required]],
      projectId: [null, Validators.required],
      purchaseOrderMaterialDTOList: this.formBuilder.array([this.formGroup()]),
      purchaseOrderNo: [null, Validators.required],
      purchaseorderDate: [null, [Validators.required]],
      referenceNo: [null],
      releaseofPayment: [null, [Validators.required]],
      releaseofperformanceGuarantee: [null, [Validators.required]],
      transporation: [null, [Validators.required]],
      vendorId: [null, Validators.required],
      cgst: [null],
      cgstPercentage: [null],
      igst: [null],
      igstPercentage: [null],
      sgst: [null],
      sgstPercentage: [null],
      totalAmount: [null, [Validators.required]],
      subTotalAmount: [null, [Validators.required]],
      contactPersonEmailId: [null, [Validators.required]],
      contactPersonMobileNo: [null, [Validators.required]],
      contactPersonName: [null, [Validators.required]],
      description: [null, [Validators.required]],
      gst: [null, [Validators.required]],
      incometax: [null, [Validators.required]],
      jobCode: [null],
      liquidatedDamagesforDelay: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      ourReferenceDate: [null, [Validators.required]],
      ourReferenceNo: [null, [Validators.required]],
      projectName: [null],
      siteContactPersonEmailId: [null, [Validators.required]],
      siteContactPersonMobileNo: [null, [Validators.required]],
      siteContactPersonName: [null, [Validators.required]],
      specialCondition: [null, [Validators.required]],
      vendorName: [null]
    });
    if (this.route.snapshot.params['id']) {
      this.getSinglePurchaseOrder(this.route.snapshot.params['id']);

    }
    this.getProject();
    this.getVendor();
    this.getOfficeDetails();
    this.getSac();
    this.getUom();
    // this.getItem();
  }
  get f() {
    return this.purchaseOrderForm.controls
  }
  get purchaseOrderMaterialDTOListArr(): FormArray {
    return this.purchaseOrderForm.get("purchaseOrderMaterialDTOList") as FormArray
  }
  add() {
    this.purchaseOrderMaterialDTOListArr.push(this.formGroup());
  }
  formGroup() {
    return this.formBuilder.group({
      priviousQty: [null],
      amount: [null, [Validators.required]],
      id: [null],
      item: [null],
      purchaseOrderId: [null],
      quantity: [null, [Validators.required]],
      sacId: [null, Validators.required],
      uomId: [null, Validators.required],
      unitRate: [null, [Validators.required]],
      workOrderDetailsId: [null],
      materialId: [null, [Validators.required]],
    });

  }

  getItem() {
    this.PurchaseOrderService.metterialGet(this.purchaseOrderForm.value.projectId).pipe(first()).subscribe(res => {
      this.itemArr = res.data;
    })
    // this.SubContractWorkOrderService.getItem(this.purchaseOrderForm.value.projectId).pipe(first()).subscribe(res => {
    //   this.itemArr = res.data;
    // })
  }
  getSupplyDetails(id, index) {
    this.PurchaseOrderService.supplyGet(id, this.purchaseOrderForm.value.projectId).pipe(first()).subscribe(res => {
      this.serviceDescriptionObj['supply' + index] = res.data;
      this.purchaseOrderMaterialDTOListArr.controls[index].patchValue({
        priviousQty: res.data.supplyQty,
        unitRate: res.data.supplyRate,
        uomId: res.data.supplyUomId
      })
    })
  }
  alert(index) {
    console.log(this.purchaseOrderMaterialDTOListArr.value[index].quantity , this.serviceDescriptionObj['supply' + index].priviousQty,this.serviceDescriptionObj['supply' + index])
    if (this.purchaseOrderMaterialDTOListArr.value[index].quantity > this.serviceDescriptionObj['supply' + index].supplyQty) {
      this.purchaseOrderMaterialDTOListArr.controls[index].patchValue({
        quantity: (this.purchaseOrderMaterialDTOListArr.value[index].quantity / 10 | 0)
      })
      this.Toastr.error("Quantity Should Be Less Than Alowed Quantity");

    }
  }
  getTitle() {
    for (let i = 0; i < this.purchaseOrderMaterialDTOListArr.value.length; i++) {
      for (let j = 0; j < this.itemArr.length; j++) {
        if (this.purchaseOrderMaterialDTOListArr.value[i].workOrderDetailsId == this.itemArr[j].id) {
          this.titleArr[i] = this.itemArr[j].itemCode;
        }
      }
    }
  }
  titleGet(index) {
    for (let i = 0; i < this.itemArr.length; i++) {

      if (this.purchaseOrderMaterialDTOListArr.value[index].workOrderDetailsId == this.itemArr[i].id) {

        this.titleArr[index] = this.itemArr[i].itemCode;

      }

    }
  }
  getSinglePurchaseOrder(id) {

    this.PurchaseOrderService.getSingleProject(id).pipe(first()).subscribe(res => {
      this.purchaseOrderArr = res.data;
      let delivery = new Date(res.data.deliveryDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let deliveryDate = { day: delivery.getDate(), month: delivery.getMonth() + 1, year: delivery.getFullYear() };
      let poDate = new Date(res.data.purchaseorderDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let purchaseorderDate = { day: poDate.getDate(), month: poDate.getMonth() + 1, year: poDate.getFullYear() };
      let ourReferenceDate = new Date(res.data.ourReferenceDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      this.purchaseOrderMaterialDTOListArr.controls = [];
      for (let i = 0; i < res.data.purchaseOrderMaterialDTOList.length; i++) {
        this.purchaseOrderMaterialDTOListArr.push(this.formGroup());
      }
      this.purchaseOrderForm.patchValue({
        companyId: res.data.companyId,
        deliveryDate: deliveryDate,
        id: res.data.id,
        modeofTranspoat: res.data.modeofTranspoat,
        projectId: res.data.projectId,
        purchaseOrderMaterialDTOList: res.data.purchaseOrderMaterialDTOList,
        purchaseOrderNo: res.data.purchaseOrderNo,
        purchaseorderDate: purchaseorderDate,
        referenceNo: res.data.referenceNo,
        vendorId: res.data.vendorId,
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        totalAmount: res.data.totalAmount,
        remarks: res.data.remarks,
        materialAdvance: res.data.materialAdvance,
        performanceGuarantee: res.data.performanceGuarantee,
        releaseofPayment: res.data.releaseofPayment,
        releaseofperformanceGuarantee: res.data.releaseofperformanceGuarantee,
        transporation: res.data.transporation,
        subTotalAmount: res.data.subTotalAmount,
        contactPersonEmailId: res.data.contactPersonEmailId,
        contactPersonMobileNo: res.data.contactPersonMobileNo,
        contactPersonName: res.data.contactPersonName,
        description: res.data.description,
        gst: res.data.gst,
        incometax: res.data.incometax,
        jobCode: res.data.jobCode,
        liquidatedDamagesforDelay: res.data.liquidatedDamagesforDelay,
        notes: res.data.notes,
        ourReferenceDate: { day: delivery.getDate(), month: delivery.getMonth() + 1, year: delivery.getFullYear() },
        ourReferenceNo: res.data.ourReferenceNo,
        projectName: res.data.projectName,
        siteContactPersonEmailId: res.data.siteContactPersonEmailId,
        siteContactPersonMobileNo: res.data.siteContactPersonMobileNo,
        siteContactPersonName: res.data.siteContactPersonName,
        specialCondition: res.data.specialCondition,
        vendorName: res.data.vendorName
      });


      setTimeout(() => {
        this.getItem();
        this.getTitle();
      }, 1000)

      this.getVendorDetails(res.data.vendorId);
      this.getProjectDetails(res.data.projectId);
      this.calculateSubTotal();
      this.spinner.hide();
      this.Toastr.success(res.message)
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getProjectDetails(id) {
    this.spinner.show();
    this.ManageProjectService.getSingleProject(id).pipe(first()).subscribe(res => {
      this.projectDetails = res.data;
      this.spinner.hide();
      if (this.purchaseOrderForm.value.projectId && this.purchaseOrderForm.value.vendorId) {
        this.vendorAndProjectIdSelected = true;
      }
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
  getVendorDetails(id) {

    this.spinner.show();

    this.VendorService.getVendorAddress(id).pipe(first()).subscribe(res => {

      this.vendorAddressObj = res.data;
      if (this.purchaseOrderForm.value.projectId && this.purchaseOrderForm.value.vendorId) {
        this.vendorAndProjectIdSelected = true;
      }

      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getOfficeDetails() {
    this.CompanySettingService.getcompany().pipe(first()).subscribe(res => {
      this.officeDetails = res.data;

      this.purchaseOrderForm.patchValue({
        companyId: res.data.id
      })
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getUom() {
    this.ApiService.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data;

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getSac() {
    this.SacCodeService.getSacCode().pipe(first()).subscribe(res => {
      this.sacArr = res.data;

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  deleteRow(index) {
    if (this.purchaseOrderMaterialDTOListArr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.purchaseOrderMaterialDTOListArr.removeAt(index);
      this.calculateSubTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  calculateAmount(index) {
    this.alert(index);
    setTimeout(() => {
      let controlArray = this.purchaseOrderForm.get("purchaseOrderMaterialDTOList") as FormArray;
      controlArray.controls[index].patchValue({
        amount: this.purchaseOrderForm.value.purchaseOrderMaterialDTOList[index].quantity * this.purchaseOrderForm.value.purchaseOrderMaterialDTOList[index].unitRate
      });
    }, 200)

  }

  calculateTotal() {
    let total = 0;
    setTimeout(() => {
      total = parseFloat(this.purchaseOrderForm.value.subTotalAmount) + parseFloat(this.purchaseOrderForm.value.igst) + parseFloat(this.purchaseOrderForm.value.cgst) + parseFloat(this.purchaseOrderForm.value.sgst);


      this.purchaseOrderForm.patchValue({
        totalAmount: total.toFixed(2)
      });
    }, 1000);
  }
  taxCalculation() {
    this.purchaseOrderForm.patchValue({
      igst: ((this.purchaseOrderForm.value.subTotalAmount * this.purchaseOrderForm.value.igstPercentage) / 100).toFixed(2),

      cgst: ((this.purchaseOrderForm.value.subTotalAmount * this.purchaseOrderForm.value.cgstPercentage) / 100).toFixed(2),

      sgst: ((this.purchaseOrderForm.value.subTotalAmount * this.purchaseOrderForm.value.sgstPercentage) / 100).toFixed(2)
    });
    this.calculateTotal();

  }

  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.purchaseOrderMaterialDTOListArr.length; i++) {
        subTotal += this.purchaseOrderMaterialDTOListArr.value[i].amount;
      };
      this.purchaseOrderForm.patchValue({
        subTotalAmount: subTotal.toFixed(2)
      })
      this.taxCalculation();
    }, 100);
  }
  // add() {
  //   this.purchaseOrderMaterialDTOListArr.push(this.formGroup());
  // }
  onSubmit() {
    this.purchaseSubmitted = true;
    if (this.purchaseOrderForm.invalid) {

      const invalid = [];
      const controls = this.purchaseOrderForm as FormGroup
      for (const name in controls.controls) {
        if (controls.controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid)
      return;
    }
    this.purchaseOrderForm.value.ourReferenceDate = this.purchaseOrderForm.value.ourReferenceDate.day + '/' + this.purchaseOrderForm.value.ourReferenceDate.month + '/' + this.purchaseOrderForm.value.ourReferenceDate.year
    this.purchaseOrderForm.value.purchaseorderDate = this.purchaseOrderForm.value.purchaseorderDate.day + '/' + this.purchaseOrderForm.value.purchaseorderDate.month + '/' + this.purchaseOrderForm.value.purchaseorderDate.year
    this.purchaseOrderForm.value.deliveryDate = this.purchaseOrderForm.value.deliveryDate.day + '/' + this.purchaseOrderForm.value.deliveryDate.month + '/' + this.purchaseOrderForm.value.deliveryDate.year
    this.spinner.show();
    if (this.purchaseOrderForm.value.id) {
      this.PurchaseOrderService.updatePurchase(this.purchaseOrderForm.value).pipe(first()).subscribe(res => {
        this.router.navigate(['app/project/purchase/order']);
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.PurchaseOrderService.createPurchase(this.purchaseOrderForm.value).pipe(first()).subscribe(res => {
        this.router.navigate(['app/project/purchase/order']);
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
}
