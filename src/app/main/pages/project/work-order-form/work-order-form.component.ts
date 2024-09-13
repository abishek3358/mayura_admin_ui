import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyService } from '../../masters/currency/currency.service';
import { DatePipe } from '@angular/common';
import { DateFormatterService } from '../../date-formatter.service';
import { ManageProjectService } from '../manage-project-form/manage-project.service';
import { VendorService } from './../../vendor-form/vendor.service';
import { ApiService } from '../../masters/unit-of-measurement/api.service';
import { SacCodeService } from '../../masters/sac-code/sac-code.service';





@Component({
  selector: 'app-work-order-form',
  templateUrl: './work-order-form.component.html',
  styleUrls: ['./work-order-form.component.scss']
})
export class WorkOrderFormComponent implements OnInit {
  public contentHeader: object;
  private stepper: Stepper;
  public datepipe: DatePipe;
  workForm: FormGroup;
  workSubmited = false;
  currencyArr: any = [];
  projectArr: any = [];
  vendorArr: any = [];
  uomArr: any = [];
  codeArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private Toastr: ToastrService,
    private _dateFormatterService: DateFormatterService,
    private route: Router,
    private router: ActivatedRoute,
    private VendorService: VendorService,
    private currencyService: CurrencyService,
    private ManageProjectService: ManageProjectService,
    private apiservice: ApiService,
    private SacCodeService: SacCodeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#stepper1'),
      {
        linear: true,
        animation: true
      });
    this.workForm = this.formBuilder.group({
      currencyId: [null, [Validators.required]],
      periodFrom: [null, [Validators.required]],
      natureofWork: [null, [Validators.required]],
      periodTo: [null, [Validators.required]],
      vendorId: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      id: [null],
      sgst: [null, [Validators.required]],
      cgst: [null, [Validators.required]],
      igst: [null, [Validators.required]],
      referenceNo: [null, [Validators.required]],
      remark: [null, [Validators.required]],
      total: [null, [Validators.required]],
      workOrderDetailsDTOList: this.formBuilder.array([this.WorkOrderDetails()]),
    });
    this.getCurrency();
    this.getProject();
    this.getVendor();
    this.getUom();
    this.getHsnSacCode();
  }
  get f() {
    return this.workForm.controls
  }
  get workOrderArr(): FormArray {
    return this.workForm.get('workOrderDetailsDTOList') as FormArray;
  }

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
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  getCurrency() {
    this.currencyService.getCurrency().pipe(first()).subscribe(res => {
      this.currencyArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getUom() {
    this.apiservice.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getHsnSacCode() {
    this.SacCodeService.getSacCode().pipe(first()).subscribe(res => {
      this.codeArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }


  horizontalWizardStepperPrevious() {
    this.stepper.previous();
  }
  goToTaxDetails() {
    this.workSubmited = true;
    if (this.workForm.value.natureofWork && this.workForm.value.currencyId && this.workForm.value.periodFrom && this.workForm.value.periodTo && this.workForm.value.projectId && this.workForm.value.vendorId) {
      this.workSubmited = false;
      this.stepper.next();
    }

  }
  gotoOrderDetails() {
    this.workSubmited = true;
    if (this.workForm.value.accountHolderName && this.workForm.value.accountNo && this.workForm.value.bankName && this.workForm.value.ifscCode && this.workForm.value.gstNumber && this.workForm.value.panNumber) {
      this.workSubmited = false;
      this.stepper.next();
    }

  }
  add() {
    this.workOrderArr.push(this.WorkOrderDetails());
  }

  WorkOrderDetails() {
    return this.formBuilder.group({
      deliveryDate: [null, [Validators.required]],
      uomName: [null],
      quantity: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      id: [null],
      unitRate: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      hsnSacCodeId: [null, [Validators.required]],

    })
  }
  onSubmit() {
    this.workSubmited = false;
    if (this.workForm.invalid) {
      return;
    }
  }

}
