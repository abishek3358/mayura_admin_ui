import { Component, OnInit } from '@angular/core';
import { CompanySettingService } from './../company-setting/company-setting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { LocationService } from '../location.service';

declare let $: any;

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  public contentHeader: object;
  private modernWizardStepper: Stepper;
  companySubmitted = false;
  companyForm: FormGroup;
  buttonText: string = "";
  companyObj: any = {};
  companyArr: any = [];
  compArr: any = [];
  compArrList: any = [];
  stateArr: any = [];
  cityArr: any = [];
  countryArr: any = [];
  stateListObj: any = {};
  cityListObj: any = {};
  // countryArr: any = []

  list;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private CompanySettingService: CompanySettingService,
    private location: LocationService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {});
    this.companyForm = this.formBuilder.group({
      companyName: [null, [Validators.required]],
      contactPersonEmail: [null, [Validators.required]],
      contactPersonName: [null, [Validators.required]],
      gst: [null, [Validators.required]],
      id: [null],
      contactPersonMobileNo: [null, [Validators.required]],
      panNo: [null, [Validators.required]],
      companyMobileNo: [null, [Validators.required]],
      companyEmail: [null, [Validators.required]],
      companyDisplayName: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      ifsCode: [null, [Validators.required]],
      companyAddressDTOList: this.formBuilder.array([this.AddressformGroup()]),
    });
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singlecompany(id);
    }
    this.get();
    this.getCountry();
    // this.getState();
    // this.getCity();
    this.singlecompany(id);
  }
  get f() {
    return this.companyForm.controls
  }

  get companyAddressListArr(): FormArray {
    return this.companyForm.get('companyAddressDTOList') as FormArray;
  }
  get() {
    this.CompanySettingService.getcompany().pipe(first()).subscribe(res => {
      this.companyObj = res.data;
    })
  }
  onSubmit() {
    this.companySubmitted = true;
    if (this.companyForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.companyForm.value.id) {
      this.CompanySettingService.updatecompany(this.companyForm.value).pipe(first()).subscribe(res => {
        this.compArr = res.data;
        this.spinner.hide();
        this.Toastr.success(res.data);
        this.route.navigate(['app/master/company/setting']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  singlecompany(id) {
    this.CompanySettingService.getcompany().pipe(first()).subscribe(res => {

      if (res.data.companyAddressDTOList[0]) {
        this.getCity(res.data.companyAddressDTOList[0].stateId, 0)
        this.getState(res.data.companyAddressDTOList[0].countryId, 0)
      }
      this.companyForm.patchValue({
        contactPersonEmail: res.data.contactPersonEmail,
        contactPersonName: res.data.contactPersonName,
        gst: res.data.gst,
        id: res.data.id,
        contactPersonMobileNo: res.data.contactPersonMobileNo,
        companyName: res.data.companyName,
        panNo: res.data.panNo,
        companyMobileNo: res.data.companyMobileNo,
        companyEmail: res.data.companyEmail,
        companyDisplayName: res.data.companyDisplayName,
        companyAddressDTOList: res.data.companyAddressDTOList,
        accountNumber: res.data.accountNumber,
        bankName: res.data.bankName,
        ifsCode: res.data.ifsCode,
      })
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }
  // getCountry() {
  //   this.location.getCountry().pipe(first()).subscribe(res => {
  //     this.countryArr = res.data;
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  // getState() {
  //   this.location.getState().pipe(first()).subscribe(res => {
  //     this.stateArr = res.data;
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  // getCity() {
  //   this.location.getCity().pipe(first()).subscribe(res => {
  //     this.cityArr = res.data;
  //   })
  // }
  getState(id, index) {
    this.spinner.show();
    this.location.singleState(id).pipe(first()).subscribe(res => {
      this.stateListObj[index] = res.data.stateList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCity(id, index) {
    this.spinner.show();
    this.location.singleCity(id).pipe(first()).subscribe(res => {
      this.cityListObj[index] = res.data.cityList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCountry() {
    this.location.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  next() {
    this.companySubmitted = true;
    // console.log(this.companyForm.value);
    if (this.companyForm.value.companyName && this.companyForm.value.contactPersonEmail
      && this.companyForm.value.contactPersonName && this.companyForm.value.gst
      && this.companyForm.value.contactPersonMobileNo && this.companyForm.value.panNo
      && this.companyForm.value.companyMobileNo && this.companyForm.value.companyDisplayName
      && this.companyForm.value.companyEmail) {
      this.companySubmitted = false;
      this.modernWizardStepper.next();

    }
  }

  AddressformGroup() {
    return this.formBuilder.group({
      addressLine1: [null, [Validators.required]],
      addressLine2: [null],
      addressType: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      id: [null],
      postalCode: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      cityName: [null, [Validators.required]],
      countryName: [null, [Validators.required]],
      stateName: [null, [Validators.required]],
    })
  }
  previous() {
    this.modernWizardStepper.previous();
  }
}
