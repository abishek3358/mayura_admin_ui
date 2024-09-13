import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { VendorService } from './vendor.service';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './../masters/location.service';
@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {
  private stepper: Stepper;
  vendorForm: FormGroup;
  vendorSubmitted = false;
  stateListObj: any = {};
  cityListObj: any = {};
  countryArr: any = []
  constructor(
    private formBuilder: FormBuilder,
    private VendorService: VendorService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private LocationService: LocationService
  ) { }

  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {});
    this.vendorForm = this.formBuilder.group({
      accountHolderName: [null, [Validators.required]],
      accountNo: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      gstNumber: [null, [Validators.required]],
      id: [null],
      ifscCode: [null, [Validators.required]],
      notes: [null],
      panNumber: [null, [Validators.required]],
      phoneNo:  [null, [Validators.required,Validators.min(1000000000),Validators.max(9999999999)]],
      service: [null, [Validators.required]],
      vendorAddressDTOList: this.formBuilder.array([this.vendorAddressGroup(), this.vendorAddressGroup()])
    });
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singleVendor(id);
    }
    this.getCountry();
  }
  singleVendor(id) {
    this.VendorService.singleVendor(id).pipe(first()).subscribe(res => {
      if (res.data.vendorAddressDTOList[0]) {
        this.getCity(res.data.vendorAddressDTOList[0].stateId, 0)
        this.getState(res.data.vendorAddressDTOList[0].countryId, 0)
      }
      if (res.data.vendorAddressDTOList[1]) {
        this.getCity(res.data.vendorAddressDTOList[1].stateId, 1)
        this.getState(res.data.vendorAddressDTOList[1].countryId, 1)
      }
      this.vendorForm.patchValue({
        accountHolderName: res.data.accountHolderName,
        accountNo: res.data.accountNo,
        bankName: res.data.bankName,
        companyName: res.data.companyName,
        email: res.data.email,
        fullName: res.data.fullName,
        gstNumber: res.data.gstNumber,
        id: res.data.id,
        ifscCode: res.data.ifscCode,
        notes: res.data.notes,
        panNumber: res.data.panNumber,
        phoneNo: res.data.phoneNo,
        service: res.data.service,
        vendorAddressDTOList: res.data.vendorAddressDTOList
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getState(id, index) {
    this.spinner.show();
    this.LocationService.singleState(id).pipe(first()).subscribe(res => {
      this.stateListObj[index] = res.data.stateList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCity(id, index) {
    this.spinner.show();
    this.LocationService.singleCity(id).pipe(first()).subscribe(res => {
      this.cityListObj[index] = res.data.cityList;
      this.spinner.hide();
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
  onSubmit() {
    this.vendorSubmitted = true;
    if (this.vendorForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.vendorForm.value.id) {
      this.VendorService.updateVendor(this.vendorForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/vendor']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.VendorService.createVendor(this.vendorForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/vendor']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
    this.vendorSubmitted = false;
  }

  get f() {
    return this.vendorForm.controls;
  }
  horizontalWizardStepperPrevious() {
    this.stepper.previous();
  }
  goToAccountDetails() {
    this.vendorSubmitted = true;
    if (this.vendorForm.value.fullName && this.vendorForm.value.email && this.vendorForm.value.phoneNo && this.vendorForm.value.companyName && this.vendorForm.value.service) {
      this.vendorSubmitted = false;
      this.stepper.next();
      let controlArray = <FormArray>this.vendorForm.controls["vendorAddressDTOList"];
      controlArray.controls[0].patchValue({ addressType: 'BILLING' });
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }
  gotoAddressDetails() {
    this.vendorSubmitted = true;
    if (this.vendorForm.value.accountHolderName && this.vendorForm.value.accountNo && this.vendorForm.value.bankName && this.vendorForm.value.ifscCode && this.vendorForm.value.gstNumber && this.vendorForm.value.panNumber) {
      this.vendorSubmitted = false;
      this.stepper.next();
    }

  }
  get vendorAddressDTOListArr(): FormArray {
    return this.vendorForm.get('vendorAddressDTOList') as FormArray;
  }

  add() {
    this.vendorAddressDTOListArr.push(this.vendorAddressGroup());
  }
  vendorAddressGroup() {
    return this.formBuilder.group({
      addressLine1: [null, [Validators.required]],
      addressLine2: [null],
      addressType: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      id: [null],
      mobileNo: [null, [Validators.required]],
      name: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
    })
  }


  changeStatus(event) {
    let controlArray = <FormArray>this.vendorForm.controls["vendorAddressDTOList"];
    if (event.target.checked == true) {
      this.vendorForm.value.vendorAddressDTOList[1].addressLine1 = this.vendorForm.value.vendorAddressDTOList[0].addressLine1
      this.vendorForm.value.vendorAddressDTOList[1].mobileNo = this.vendorForm.value.vendorAddressDTOList[0].mobileNo
      this.vendorForm.value.vendorAddressDTOList[1].name = this.vendorForm.value.vendorAddressDTOList[0].name
      this.vendorForm.value.vendorAddressDTOList[1].postalCode = this.vendorForm.value.vendorAddressDTOList[0].postalCode
      this.vendorForm.value.vendorAddressDTOList[1].addressLine2 = this.vendorForm.value.vendorAddressDTOList[0].addressLine2
      this.vendorForm.value.vendorAddressDTOList[1].countryId = this.vendorForm.value.vendorAddressDTOList[0].countryId
      this.vendorForm.value.vendorAddressDTOList[1].stateId = this.vendorForm.value.vendorAddressDTOList[0].stateId
      this.vendorForm.value.vendorAddressDTOList[1].cityId = this.vendorForm.value.vendorAddressDTOList[0].cityId

      this.stateListObj[1] = this.stateListObj[0]
      this.cityListObj[1] = this.cityListObj[0]
      this.vendorForm.patchValue({
        vendorAddressDTOList: this.vendorForm.value.vendorAddressDTOList,
      })
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    } else if (event.target.checked == false) {
      controlArray.controls[1].reset();
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }
}

