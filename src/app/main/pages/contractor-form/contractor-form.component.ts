import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { first } from 'rxjs/operators';
import { LocationService } from './../masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { ContractorService } from './contractor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debug } from 'console';

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss']
})
export class ContractorFormComponent implements OnInit {


  public contentHeader: object;
  private modernWizardStepper: Stepper;
  contractorForm: FormGroup;
  contractorSubmited = false;
  countryArr: any = [];
  stateListObj: any = {};
  cityObj: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private location: LocationService,
    private Toastr: ToastrService,
    private ContractorService: ContractorService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper1'), {});

    this.contractorForm = this.formBuilder.group({
      companyName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      gstNumber: [null, [Validators.required]],
      id: [null],
      mobileNo: [null, [Validators.required]],
      panNumber: [null, [Validators.required]],
      accountHolderName: [null, [Validators.required]],
      accountNo: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      ifscCode: [null, [Validators.required]],
      contractorAddressList: this.formBuilder.array([this.AddressformGroup(), this.AddressformGroup()]),
    });

    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singleContractor(id);
    }
    this.getCountry();
  }


  get f() {
    return this.contractorForm.controls
  }
  get contractorAddressListArr(): FormArray {
    return this.contractorForm.get('contractorAddressList') as FormArray;
  }
  getCountry() {
    this.location.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    })
  }
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
  onSubmit() {
    this.contractorSubmited = true;
    if (this.contractorForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.contractorForm.value.id) {
      this.ContractorService.updateContractor(this.contractorForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/contractor']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.ContractorService.createContractor(this.contractorForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/contractor']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  //single get 
  singleContractor(id) {
    this.ContractorService.singleContractor(id).pipe(first()).subscribe(res => {
      // console.log(res.data.contractorAddressList);
      let count = 0;
      for (let obj of res.data.contractorAddressList) {
        if (obj.addressType == "BILLING") {
          this.contractorAddressListArr.controls[0].patchValue({
            addressLine1: obj.addressLine1,
            addressLine2: obj.addressLine2,
            addressType: obj.addressType,
            countryId: obj.countryId,
            cityId: obj.cityId,
            id: obj.id,
            postalCode: obj.postalCode,
            stateId: obj.stateId,
          })
          this.getCity(res.data.contractorAddressList[count].stateId, 0)
          this.getState(res.data.contractorAddressList[count].countryId, 0)
        } else {
          this.contractorAddressListArr.controls[1].patchValue({
            addressLine1: obj.addressLine1,
            addressLine2: obj.addressLine2,
            addressType: obj.addressType,
            countryId: obj.countryId,
            cityId: obj.cityId,
            id: obj.id,
            postalCode: obj.postalCode,
            stateId: obj.stateId,
          })
          this.getCity(res.data.contractorAddressList[count].stateId, 1)
          this.getState(res.data.contractorAddressList[count].countryId, 1)
        }
        count++;
      }

      //  if(res.data.contractorAddressList[0]) {
      //   this.getCity(res.data.contractorAddressList[0].stateId, 0)
      //   this.getState(res.data.contractorAddressList[0].countryId, 0)
      // }
      // if (res.data.contractorAddressList[1]) {
      //   this.getCity(res.data.contractorAddressList[1].stateId, 1)
      //   this.getState(res.data.contractorAddressList[1].countryId, 1)
      // }

      const mapingList = <FormArray>this.contractorForm.controls['contractorAddressList']
      // mapingList.controls = [];
      this.contractorForm.patchValue({
        email: res.data.email,
        fullName: res.data.fullName,
        gstNumber: res.data.gstNumber,
        id: res.data.id,
        mobileNo: res.data.mobileNo,
        companyName: res.data.companyName,
        panNumber: res.data.panNumber,
        accountHolderName: res.data.accountHolderName,
        accountNo: res.data.accountNo,
        bankName: res.data.bankName,
        ifscCode: res.data.ifscCode
        // contractorAddressList: res.data.contractorAddressList,
      })
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }
  //
  getCity(id, index) {
    this.spinner.show();
    this.location.singleCity(id).pipe(first()).subscribe(res => {
      this.cityObj[index] = res.data.cityList;
      this.spinner.hide();
    })
  }
  next() {
    this.contractorSubmited = true;
    if (this.contractorForm.value.companyName && this.contractorForm.value.email && this.contractorForm.value.fullName && this.contractorForm.value.gstNumber && this.contractorForm.value.mobileNo && this.contractorForm.value.panNumber) {
      this.contractorSubmited = false;
      this.modernWizardStepper.next();
      let controlArray = <FormArray>this.contractorForm.controls["contractorAddressList"];
      controlArray.controls[0].patchValue({ addressType: 'BILLING' });
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }

  add() {
    this.contractorAddressListArr.push(this.AddressformGroup());
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
      countryId: [null, [Validators.required]]
    })
  }
  previous() {
    this.modernWizardStepper.previous();
  }

  changeStatus(event) {
    let controlArray = <FormArray>this.contractorForm.controls["contractorAddressList"];
    if (event.target.checked == true) {
      this.contractorForm.value.contractorAddressList[1].addressLine1 = this.contractorForm.value.contractorAddressList[0].addressLine1
      this.contractorForm.value.contractorAddressList[1].name = this.contractorForm.value.contractorAddressList[0].name
      this.contractorForm.value.contractorAddressList[1].postalCode = this.contractorForm.value.contractorAddressList[0].postalCode
      this.contractorForm.value.contractorAddressList[1].addressLine2 = this.contractorForm.value.contractorAddressList[0].addressLine2
      this.contractorForm.value.contractorAddressList[1].countryId = this.contractorForm.value.contractorAddressList[0].countryId
      this.contractorForm.value.contractorAddressList[1].stateId = this.contractorForm.value.contractorAddressList[0].stateId
      this.contractorForm.value.contractorAddressList[1].cityId = this.contractorForm.value.contractorAddressList[0].cityId

      this.cityObj[1] = this.cityObj[0]
      this.stateListObj[1] = this.stateListObj[0];
      this.contractorForm.patchValue({
        contractorAddressList: this.contractorForm.value.contractorAddressList,
      })
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    } else if (event.target.checked == false) {
      controlArray.controls[1].reset();
      controlArray.controls[1].patchValue({ addressType: 'SHIPPING' });
    }
  }
}

