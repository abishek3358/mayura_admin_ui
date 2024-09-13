import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Stepper from 'bs-stepper';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { first } from 'rxjs/operators';
import { ManageVendorService } from '../manage-vendor.service';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../master/location.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manage-vendor',
  templateUrl: './manage-vendor.component.html',
  styleUrls: ['./manage-vendor.component.scss']
})
export class ManageVendorComponent implements OnInit {

  title = 'google-places-autocomplete';
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  vendorForm: FormGroup;
  vendorFormSubmitted = false;
  private stepper: Stepper;
  vendorId: any
  vendorObj: any = {}
  buttonText = "Submit";
  countryArr: any = [];
  stateArr: any = [];
  cityArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private manageVendorService: ManageVendorService,
    private toastr: ToastrService,
    private locationService: LocationService,
    public zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,

  ) {}

  ngOnInit(): void {

    this.vendorId = this.route.snapshot.params['id']
    this.vendorForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      status:[null,[Validators.required]],
      vendorCode: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      emailId: [null, [Validators.required,Validators.email]],
      gstTaxNumber: [null, [Validators.required]],
      vendorContactPersonList: this.formBuilder.array(
        [this.vendorFormGroup()],
        [Validators.required]),
      vendorBranchList: this.formBuilder.array(
        [this.vendorBranchFormGroup()],
        [Validators.required],
      ),
      vendorAccountList: this.formBuilder.array(
        [this.vendorAccountFormGroup()],
        [Validators.required]
      )

    });
    if (this.vendorId) {
      this.editVendor()
    }
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true
    });
    this.getCountry();

  }
  get f() {
    return this.vendorForm.controls;
  }
  get vendorContactArr(): FormArray {
    return this.vendorForm.get('vendorContactPersonList') as FormArray;
  }
  get vendorAccount(): FormArray {
    return this.vendorForm.get('vendorAccountList') as FormArray;
  }
  onUpdateBasicInfo() {
    this.vendorFormSubmitted = true;
    if (this.vendorForm.value.id) {
      this.manageVendorService.updateVendor(this.vendorForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);

      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
    this.vendorFormSubmitted = false;
  }

  vendorFormGroup() {
    return this.formBuilder.group({
      id: [null],
      vendorId: [null],
      fullName: [null, Validators.required],
      emailId: [null, Validators.required],
      phoneNumber: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      contactPersonRole: [null, Validators.required],
      markAsDefault: [null, Validators.required]
    })
  }
  addVendorContact() {
    if(this.vendorContactArr.length<=5){
    this.vendorContactArr.push(this.vendorFormGroup());}
    else{
      this.toastr.error("Maximum row added")
      return true;

    }
  }

  onUpdateContactList(data) {
    this.vendorFormSubmitted = true;
    if (data.value.id) {
      this.manageVendorService.contactUpdate(data.value, this.vendorId).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
},
err => {
  this.spinner.hide();
  this.toastr.error(err.error.error.reason);
})

    } else {
      data.value.vendorId = this.vendorId;
      this.manageVendorService.contactCreate(data.value, this.vendorId).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.editVendor();
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
    this.vendorFormSubmitted = false;
  }
  deleteVendorContact(vendorId, data, index) {
    if (this.vendorContactArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else if (data.value.phoneNumber == null || data.value.fullName == null || data.value.emailId == null || data.value.contactPersonRole == null) {
      this.vendorContactArr.removeAt(index);
      return true;
    } else {
      this.manageVendorService.contactDelete(vendorId, data.value.id).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.editVendor();
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
  }
  vendorBranchFormGroup() {
    return this.formBuilder.group({
      id: [null],
      vendorId: [null],
      branchName: [null, Validators.required],
      branchCode: [null, Validators.required],
      location: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      address1: [null, Validators.required],
      address2:[""],
      postalCode: [null,[ Validators.required,Validators.pattern("[0-9]{6}")]],
      countryId: [null, Validators.required],
      stateId: [null, Validators.required],
      cityId: [null, Validators.required],
    })
  }
  addVendorBranch() {
    if(this.vendorBranchArr.length<=5){
    this.vendorBranchArr.push(this.vendorBranchFormGroup());}
    else{  this.toastr.error("Maximum row added");
    return false;

    }
  }

  onUpdateBranchList(data) {
    this.vendorFormSubmitted = true;
    if (data.value.id) {
      this.manageVendorService.branchUpdate(data.value, this.vendorId).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);

      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    } else {
      data.value.vendorId = this.vendorId;
      this.manageVendorService.branchCreate(data.value, this.vendorId).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.editVendor();
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
    this.vendorFormSubmitted = false;
  }
  deleteVendorBranch(vendorId, data, index) {
    if (this.vendorBranchArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else if (data.value.branchName == null || data.value.branchCode == null || data.value.location == null || data.value.latitude == null || data.value.longitude == null || data.value.address1 == null) {
      this.vendorBranchArr.removeAt(index);
      return true;
    } else {
      this.manageVendorService.branchDelete(vendorId, data.value.id).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.editVendor();
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
  }

  vendorAccountFormGroup() {
    return this.formBuilder.group({
      commissionPercentage: [null, [Validators.required]],
      payoutPeriod: [null, [Validators.required]],
      id: [null],
      vendorId: [null]
    })
  }

  handleAddressChange(address: any, index: number) {
    (this.vendorForm.get("vendorBranchList") as FormArray).at(index).get("latitude").patchValue(address.geometry.location.lat());
    (this.vendorForm.get("vendorBranchList") as FormArray).at(index).get("longitude").patchValue(address.geometry.location.lng());
    (this.vendorForm.get("vendorBranchList") as FormArray).at(index).get("location").patchValue(address.formatted_address);
    // (this.vendorForm.get("vendorBranchList") as FormArray).at(index).get("postalCode").patchValue(address.address_components[4].long_name);



  }


  get vendorBranchArr(): FormArray {
    return this.vendorForm.get('vendorBranchList') as FormArray;
  }



  goToVendorContact() {
    this.vendorFormSubmitted = true;
    if (this.vendorForm.get("name").valid && this.vendorForm.get("vendorCode").valid && 
    this.vendorForm.get("phoneNumber").valid  &&
    this.vendorForm.get("emailId").valid &&
    this.vendorForm.get("gstTaxNumber").valid)    {
      this.stepper.next();
      this.vendorFormSubmitted = false;
    }
  }
  goToVendorBranch() {
    this.vendorFormSubmitted = true;
    
    if (this.vendorForm.get("vendorContactPersonList").valid)
   
  {

      this.stepper.next();

      this.vendorFormSubmitted = false;
    }
  }
  goToVendorAccount() {
    this.vendorFormSubmitted = true;
   
    if (this.vendorForm.get("vendorBranchList").valid) {

      this.stepper.next();

      this.vendorFormSubmitted = false;
    }
  }

  onSubmit() {
    this.vendorFormSubmitted = true;
    if (this.vendorForm.invalid) {
      return;
    }
    if (this.vendorForm.value.id) {

      this.manageVendorService.accountUpdate(this.vendorForm.value.vendorAccountList[0], this.vendorId).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.router.navigate(['admin/vendor-management/vendors']);
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    } else {
      this.manageVendorService.createVendor(this.vendorForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.router.navigate(['admin/vendor-management/vendors']);
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
    this.vendorFormSubmitted = false;
  }
 
  editVendor() {

    this.manageVendorService.singleVendor(this.vendorId).pipe(first()).subscribe(res => {
      this.vendorObj = res.data;
      this.vendorForm.patchValue({
        name: res.data.name,
        vendorCode: res.data.vendorCode,
        phoneNumber: res.data.phoneNumber,
        emailId: res.data.emailId,
        gstTaxNumber: res.data.gstTaxNumber,
        status: res.data.status,
        id: res.data.id,

      }
    
      );
      const vendorContactPersonList = <FormArray>this.vendorForm.controls['vendorContactPersonList'];
      vendorContactPersonList.controls = [];
      for (let i = 0; i < this.vendorObj.vendorContactPersonList.length; i++) {
        vendorContactPersonList.push(this.vendorFormGroup());
      }
      this.vendorForm.patchValue({ vendorContactPersonList: this.vendorObj.vendorContactPersonList });

      const vendorBranchList = <FormArray>this.vendorForm.controls['vendorBranchList'];
      vendorBranchList.controls = [];
      for (let i = 0; i < this.vendorObj.vendorBranchList.length; i++) {
        this.getState(this.vendorObj.vendorBranchList[i].countryId);
        this.getCity(this.vendorObj.vendorBranchList[i].stateId)
        vendorBranchList.push(this.vendorBranchFormGroup());
      }
      this.vendorForm.patchValue({ vendorBranchList: this.vendorObj.vendorBranchList });

      const vendorAccountList = <FormArray>this.vendorForm.controls['vendorAccountList'];
      vendorAccountList.controls = [];
      for (let i = 0; i < this.vendorObj.vendorAccountList.length; i++) {
        vendorAccountList.push(this.vendorAccountFormGroup());
      }
      this.vendorForm.patchValue({ vendorAccountList: this.vendorObj.vendorAccountList });

      this.toastr.success(res.message);

    })
    this.buttonText = "Update";

  }

  modernVerticalPrevious() {
    this.vendorFormSubmitted = true;
    this.stepper.previous();
  }


  getCountry() {
    this.locationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getState(event: any) {
    this.locationService.getState(event).pipe(first()).subscribe(res => {
      this.stateArr = res.data;
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getCity(event: any) {
    this.locationService.getAllCity().pipe(first()).subscribe(res => {
      this.cityArr = res.data;
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

}
