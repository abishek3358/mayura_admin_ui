import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ManageProjectService } from './manage-project.service';
import Stepper from 'bs-stepper';
import { DatePipe } from '@angular/common';
import { DateFormatterService } from '../../date-formatter.service';
import { VendorService } from './../../vendor-form/vendor.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationService } from '../../masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
declare let $: any;
import { CurrencyService } from '../../masters/currency/currency.service';
import { SacCodeService } from '../../masters/sac-code/sac-code.service';
import { ApiService } from '../../masters/unit-of-measurement/api.service';
import { DecimalPipe } from '@angular/common';
import { EmployeeService } from './../employee/employee.service';
import { environment } from 'environments/environment';
import { CustomerService } from '../../customer/customer.service';
import { CompanyListService } from '../../masters/company-list/company-list.service';
import { CompanySettingService } from '../../masters/company-setting/company-setting.service';
@Component({
  selector: 'app-manage-project-form',
  templateUrl: './manage-project-form.component.html',
  styleUrls: ['./manage-project-form.component.scss'],
  providers: [DecimalPipe]
})
export class ManageProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  projectFormSubmitted = false;
  private stepper: Stepper;
  public datepipe: DatePipe;
  customerArr: any = [];
  stateList: any = [];
  cityList: any = [];
  countryArr: any = [];
  currencyArr: any = [];
  sacArr: any = [];
  isCollapsed: boolean;
  isScrolled: boolean = false;
  uomArr: any = [];
  addressObj: any = {};
  customerAddressObj: any = {};
  empArr: any = [];
  _baseUrl = environment.apiUrl;
  fileShow = true;
  fileShowObj: any = {};
  companyObj:any={};
  fileLength: number;
  constructor(
    private formBuilder: FormBuilder,
    private ManageProjectService: ManageProjectService,
    private VendorService: VendorService,
    private _dateFormatterService: DateFormatterService,
    private spinner: NgxSpinnerService,
    private LocationService: LocationService,
    private Toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private CurrencyService: CurrencyService,
    private SacCodeService: SacCodeService,
    private ApiService: ApiService,
    private _decimalPipe: DecimalPipe,
    private EmployeeService: EmployeeService,
    private CustomerService: CustomerService,
    private companyService:CompanySettingService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      wodNumber: [null, [Validators.required]],
      addressLine1: [null, [Validators.required]],
      addressLine2: [null],
      cityId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      totalDays: [null, [Validators.required]],
      totalMonths: [null, [Validators.required]],
      finalisedCost: [null, [Validators.required]],
      id: [null],
      projectGst: [null, [Validators.required]],
      finalisedGst: [null, [Validators.required]],
      jobCode: [null, [Validators.required]],
      projectName: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      projectedCost: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
      natureOfWork: [null, [Validators.required]],
      projectInchargeDTOList: this.formBuilder.array([this.incharegeFormGroup()], Validators.required),
      workOrderDTOObject: this.formBuilder.group({
        gstNumber: [null, [Validators.required]],
        panNumber: [null, [Validators.required]],
        totalTaxValue: [null, [Validators.required]],
        total: [0, [Validators.required]],
        netValue: [0, [Validators.required]],
        notes: [null, Validators.required],
        id: [null],
        projectId: [null],
        workOrderDetailsDTOList: this.formBuilder.array([this.formGroup()]),
      }),
    });

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true
    });
    if (this.route.snapshot.params['id']) {
      this.getSingleProject(this.route.snapshot.params['id']);
    }
    this.getCustomer();
    this.getCountry();
    this.getCurrency();
    this.getSac();
    this.getUom();
    this.getEmployee();
    this.getCompanyDetail();
    console.clear();
    console.log(this.projectForm)
  }


  get f() {
    return this.projectForm.controls;
  }
  get b() {
    let workOrderDTOObj = this.projectForm.get('workOrderDTOObject') as FormGroup;
    return workOrderDTOObj.controls;
  }
  get workOrderDTOObj() {
    return this.projectForm.get('workOrderDTOObject') as FormGroup;
  }
  get tableArrList(): FormArray {
    let workOrderDTOObj = this.projectForm.get('workOrderDTOObject') as FormGroup;
    return workOrderDTOObj.get('workOrderDetailsDTOList') as FormArray;
  }

  get inchargeList(): FormArray {
    return this.projectForm.get('projectInchargeDTOList') as FormArray;
  }
  formGroup() {
    return this.formBuilder.group({
      workOrderId: [null],
      serviceDescription: [null, [Validators.required]],
      sacId: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
      unitRate: [0, [Validators.required]],
      tax: [null, [Validators.required]],
      totalValueWithTax: [0, [Validators.required]],
      totalValueWithoutTax: [0, [Validators.required]],
      id: [null]
    });
  }

  incharegeFormGroup() {
    return this.formBuilder.group({
      designation: [null, Validators.required],
      id: [null],
      inchargeName: [null, Validators.required],
      mobileNo: [null, Validators.required],
      projectId: [null],
      telephoneNo: [null]
    })

  }

  add() {
    this.tableArrList.push(this.formGroup());
  }
  addIncharge() {
    console.log(this.inchargeList);
    this.inchargeList.push(this.incharegeFormGroup());
  }
  getCompanyDetail(){
    this.companyService.getcompany().pipe(first()).subscribe(res=>{
      console.log(res.data);
      this.companyObj = res.data.companyAddressDTOList[0]
    })
  }

  getSingleProject(id) {
    this.ManageProjectService.getSingleProject(id).pipe(first()).subscribe(res => {
      this.fileShow = false;
      let projectStart = new Date(res.data.startDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let startDate = { day: projectStart.getDate(), month: projectStart.getMonth() + 1, year: projectStart.getFullYear() };
      let projectEnd = new Date(res.data.endDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let endDate = { day: projectEnd.getDate(), month: projectEnd.getMonth() + 1, year: projectEnd.getFullYear() };
      // let woDateDetail = new Date(res.data.workOrderDTOObject.woDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      // let woDate = { day: woDateDetail.getDate(), month: woDateDetail.getMonth() + 1, year: woDateDetail.getFullYear() };
      // res.data.workOrderDTOObject.woDate = woDate;

      this.tableArrList.controls = [];
      for (let i = 0; i < res.data.workOrderDTOObject.workOrderDetailsDTOList.length; i++) {
        this.tableArrList.push(this.formGroup());
      }
      this.inchargeList.controls = [];
      for (let i = 0; i < res.data.projectInchargeDTOList.length; i++) {
        this.inchargeList.push(this.incharegeFormGroup())
      }

      this.projectForm.patchValue({
        addressLine1: res.data.addressLine1,
        addressLine2: res.data.addressLine2,
        cityId: res.data.cityId,
        countryId: res.data.countryId,
        description: res.data.description,
        endDate: endDate,
        estimatedDays: res.data.estimatedDays,
        finalisedCost: res.data.finalisedCost,
        id: res.data.id,
        jobCode: res.data.jobCode,
        projectName: res.data.projectName,
        postalCode: res.data.postalCode,
        projectedCost: res.data.projectedCost,
        startDate: startDate,
        stateId: res.data.stateId,
        customerId: res.data.customerId,
        workOrderDTOObject: res.data.workOrderDTOObject,
        incharge: res.data.incharge,
        inchargePhoneNumber: res.data.inchargePhoneNumber,
        detailedDescription: res.data.detailedDescription,
        inchargeList: res.data.inchargeList,
        natureOfWork: res.data.natureOfWork,
        projectGst: res.data.projectGst,
        finalisedGst: res.data.finalisedGst,
        totalDays: res.data.totalDays,
        totalMonths: res.data.totalMonths,
        wodNumber: res.data.wodNumber,
        projectInchargeDTOList: res.data.projectInchargeDTOList
      })
      this.getState(res.data.countryId);
      this.getCity(res.data.stateId);
      this.getCustomerAddress(res.data.customerId);

      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getEmployee() {
    this.EmployeeService.getEmp().pipe(first()).subscribe(res => {
      this.empArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getCustomer() {
    this.CustomerService.getCustomer().pipe(first()).subscribe(res => {
      this.customerArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCountry() {
    this.LocationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getState(id) {
    this.spinner.show();
    this.LocationService.singleState(id).pipe(first()).subscribe(res => {
      this.stateList = res.data.stateList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCity(id) {
    this.spinner.show();
    this.LocationService.singleCity(id).pipe(first()).subscribe(res => {
      this.cityList = res.data.cityList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCurrency() {
    this.CurrencyService.getCurrency().pipe(first()).subscribe(res => {
      this.currencyArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getSac() {
    this.SacCodeService.getSacCode().pipe(first()).subscribe(res => {
      this.sacArr = res.data;
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
  getCustomerAddress(id) {
    this.CustomerService.singleCustomer(id).pipe(first()).subscribe(res => {
      console.log(res);
      for (let customer of res.data.customerAddressList) {
        if (customer.addressType == 'BILLING') {
          this.customerAddressObj = customer;
        }
      }

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }


  onSubmit() {
    this.projectFormSubmitted = true;
    if (this.projectForm.invalid) {
      return;
    }
    this.spinner.show();
    this.projectForm.value.startDate = this.projectForm.value.startDate.day + '/' + this.projectForm.
      value.startDate.month + '/' + this.projectForm.value.startDate.year;
    this.projectForm.value.endDate = this.projectForm.value.endDate.day + '/' + this.projectForm.
      value.endDate.month + '/' + this.projectForm.value.endDate.year;

    if (this.projectForm.value.id) {
      this.ManageProjectService.updateProject(this.projectForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/project/manage/project']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.ManageProjectService.createProject(this.projectForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/project/manage/project']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }

  }
  EstimatedDays() {
    if (this.f.startDate.valid && this.f.endDate.valid) {
      let remainddays = Math.floor((Date.UTC(this.projectForm.value.startDate.year, this.projectForm.value.startDate.month, this.projectForm.value.startDate.day) - Date.UTC(this.projectForm.value.endDate.year, this.projectForm.value.endDate.month, this.projectForm.value.endDate.day)) / (1000 * 60 * 60 * 24));
      this.projectForm.patchValue({
        totalDays: ~remainddays + 1,
        totalMonths: this.projectForm.value.endDate.month - this.projectForm.value.startDate.month +
          (12 * (this.projectForm.value.endDate.year - this.projectForm.value.startDate.year))
      })

    }
  }





  calculateTotal() {
    let total = 0,
      totalTax = 0,
      totalWithTax = 0;
    for (let totalValue of this.tableArrList.value) {
      total += totalValue.totalValueWithoutTax;
      totalTax += totalValue.tax,
        totalWithTax += totalValue.totalValueWithTax;
      console.clear();
      console.log(total, totalTax, totalWithTax);
    }


    this.projectForm.get('workOrderDTOObject').patchValue({
      totalTaxValue: (totalTax).toFixed(2),
      total: (total).toFixed(2),
      netValue: (totalWithTax).toFixed(2)
    })


  }
  taxCalculation(index) {
    console.log(this.tableArrList.value[index].quantity, this.tableArrList.value[index].unitRate, parseFloat(this.tableArrList.value[index].tax))
    this.tableArrList.controls[index].patchValue({
      tax: parseFloat((((this.tableArrList.value[index].quantity * this.tableArrList.value[index].unitRate) * 12) / 100).toFixed(2)),
    })
    setTimeout(() => {
      this.tableArrList.controls[index].patchValue({
        totalValueWithTax: (this.tableArrList.value[index].quantity * this.tableArrList.value[index].unitRate) + parseFloat(this.tableArrList.value[index].tax),
        totalValueWithoutTax: this.tableArrList.value[index].quantity * this.tableArrList.value[index].unitRate
      })
      setTimeout(() => {
        this.calculateTotal();
      }, 100)
    }, 10);

  }


  modernVerticalPrevious() {
    this.projectFormSubmitted = true;
    this.stepper.previous();
  }
  goToAddress() {
    this.projectFormSubmitted = true;
    if (this.projectForm.value.projectName && this.projectForm.value.projectGst && this.projectForm.value.finalisedGst && this.projectForm.value.customerId && this.projectForm.value.jobCode && this.projectForm.value.projectedCost && this.projectForm.value.totalDays && this.projectForm.value.totalMonths != null && this.projectForm.value.totalMonths != undefined && this.projectForm.value.finalisedCost && this.projectForm.value.startDate && this.projectForm.value.endDate && this.projectForm.value.natureOfWork && this.projectForm.get('projectInchargeDTOList').valid && this.projectForm.value.workOrderDTOObject.panNumber && this.projectForm.value.workOrderDTOObject.gstNumber) {
      this.stepper.next();
      this.projectFormSubmitted = false;
    }
  }


  goToWorkOrder() {
    this.projectFormSubmitted = true;
    if (this.projectForm.value.addressLine1 && this.projectForm.value.countryId && this.projectForm.value.stateId && this.projectForm.value.cityId && this.projectForm.value.postalCode) {
      this.stepper.next();
      this.projectFormSubmitted = false;
      let addressCity = '';
      let addressCountry = '';
      let addressState = '';
      for (let city of this.cityList) {
        if (city.id == this.projectForm.value.cityId) {
          addressCity = city.name
        }
      }
      for (let state of this.stateList) {
        if (state.id == this.projectForm.value.stateId) {
          addressState = state.name
        }
      }
      for (let country of this.countryArr) {
        if (country.id == this.projectForm.value.countryId) {
          addressCountry = country.name
        }
      }
      this.addressObj = {
        addressLine1: this.projectForm.value.addressLine1,
        postalCode: this.projectForm.value.postalCode,
        city: addressCity,
        state: addressState,
        country: addressCountry
      }
      this.workOrderDTOObj.patchValue({
        periodFrom: this.projectForm.value.startDate,
        periodTo: this.projectForm.value.endDate,
        projectAddress: addressCity
      });

    }
  }
  downloadFile(index) {
    this.spinner.show();

    var win = window.open(this._baseUrl + 'api/project/download/' + this.projectForm.value.id + '/' + this.projectForm.value.workOrderFileUploadDTOList[index].id);
    win.focus();
    this.spinner.hide();
  }
  reUpload(index) {
    this.fileShowObj[index] = index
  }
  deleteIncharge(index){
    if (this.inchargeList.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.inchargeList.removeAt(index);
      this.calculateTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
  deleteRow(index) {
    if (this.tableArrList.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.tableArrList.removeAt(index);
      this.calculateTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }

}
