import { Component, OnInit } from '@angular/core';
import { CustomerFormService } from './customer-form.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './../masters/location.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  private stepper: Stepper;
  customerForm: FormGroup;
  customerSubmitted = false;
  cityListObj: any = {};
  cityArr: any = [];
  id: any;
  stateListObj: any = {};
  countryArr: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private CustomerService: CustomerFormService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private LocationService: LocationService
  ) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.stepper = new Stepper(document.querySelector('#stepper1'), {});
    this.customerForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      gstNumber: [null, [Validators.required]],
      id: [null],
      panNumber: [null, [Validators.required]],
      mobileNo: [null, [Validators.required]],
      customerAddressList: this.formBuilder.array([this.customerAddressGroup(), this.customerAddressGroup()])
    });


    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singleCustomer(id);
    }
    this.getCountry();
  }
  singleCustomer(id) {
    this.CustomerService.singleCustomer(id).pipe(first()).subscribe(res => {
      this.customerAddressList.controls = [];
      for (let address of res.data.customerAddressList) {
        this.customerAddressList.push(this.customerAddressGroup());
        setTimeout(() => {
          if (address.addressType == "BILLING") {
            this.customerAddressList.controls[0].patchValue({
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              addressType: address.addressType,
              countryId: address.countryId,
              stateId: address.stateId,
              cityId: address.cityId,
              id: address.id,
              mobileNo: address.mobileNo,
              name: address.name,
              postalCode: address.postalCode,
            })
            this.getCity(address.stateId, 0)
            this.getState(address.countryId, 0)
          } else {
            this.customerAddressList.controls[1].patchValue({
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              addressType: address.addressType,
              countryId: address.countryId,
              stateId: address.stateId,
              cityId: address.cityId,
              id: address.id,
              mobileNo: address.mobileNo,
              name: address.name,
              postalCode: address.postalCode,
            })
            this.getCity(address.stateId, 1)
            this.getState(address.countryId, 1)
          }
        }, 1000)

      }
      // const MappingList = <FormArray>this.customerForm.controls['customerAddressList']
      this.customerForm.patchValue({
        email: res.data.email,
        fullName: res.data.fullName,
        gstNumber: res.data.gstNumber,
        id: res.data.id,
        panNumber: res.data.panNumber,
        mobileNo: res.data.mobileNo,
        // customerAddressList: res.data.customerAddressList
      })
      this.getCountry();
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

  // getCity() {
  //   this.LocationService.getCity().pipe(first()).subscribe(res => {
  //     this.cityArr = res.data;
  //     console.log(this.cityArr)
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   });
  // }
  getCountry() {
    this.LocationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    })
  }
  onSubmit() {
    this.customerSubmitted = true
    if (this.customerForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.customerForm.value.id) {
      this.CustomerService.updateCustomer(this.customerForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/customer']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.CustomerService.createCustomer(this.customerForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/customer']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
    this.customerSubmitted = false;
  }

  get f() {
    return this.customerForm.controls;
  }
  horizontalWizardStepperPrevious() {
    this.stepper.previous();
  }
  goToAccountDetails() {
    this.customerSubmitted = true;
    if (this.customerForm.value.fullName && this.customerForm.value.email
      && this.customerForm.value.mobileNo && this.customerForm.value.panNumber
      && this.customerForm.value.gstNumber) {
      this.customerSubmitted = false;
      this.stepper.next();
      let controlArray = <FormArray>this.customerForm.controls["customerAddressList"];
      controlArray.controls[0].patchValue({ addressType: 'BILLING' });
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }

  get customerAddressList(): FormArray {
    return this.customerForm.get('customerAddressList') as FormArray;
  }

  add() {
    this.customerAddressList.push(this.customerAddressGroup());
  }
  customerAddressGroup() {
    return this.formBuilder.group({
      addressLine1: [null, [Validators.required]],
      addressLine2: [null],
      addressType: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      id: [null],
      mobileNo: [null, [Validators.required]],
      name: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
    })
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

  changeStatus(event) {
    let controlArray = <FormArray>this.customerForm.controls["customerAddressList"];
    if (event.target.checked == true) {
      this.customerForm.value.customerAddressList[1].addressLine1 = this.customerForm.value.customerAddressList[0].addressLine1
      this.customerForm.value.customerAddressList[1].mobileNo = this.customerForm.value.customerAddressList[0].mobileNo
      this.customerForm.value.customerAddressList[1].name = this.customerForm.value.customerAddressList[0].name
      this.customerForm.value.customerAddressList[1].postalCode = this.customerForm.value.customerAddressList[0].postalCode
      this.customerForm.value.customerAddressList[1].addressLine2 = this.customerForm.value.customerAddressList[0].addressLine2
      this.customerForm.value.customerAddressList[1].countryId = this.customerForm.value.customerAddressList[0].countryId
      this.customerForm.value.customerAddressList[1].stateId = this.customerForm.value.customerAddressList[0].stateId
      this.customerForm.value.customerAddressList[1].cityId = this.customerForm.value.customerAddressList[0].cityId
      this.stateListObj[1] = this.stateListObj[0];
      this.cityListObj[1] = this.cityListObj[0];
      this.customerForm.patchValue({
        customerAddressList: this.customerForm.value.customerAddressList,
      })
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    } else if (event.target.checked == false) {
      controlArray.controls[1].reset();
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }
}