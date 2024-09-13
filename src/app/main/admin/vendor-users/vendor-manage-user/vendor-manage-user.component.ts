import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'app/auth/helpers/must-match.validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ManageVendorService } from '../../vendor management/manage-vendor.service';


@Component({
  selector: 'app-vendor-manage-user',
  templateUrl: './vendor-manage-user.component.html',
  styleUrls: ['./vendor-manage-user.component.scss']
})
export class VendorManageUserComponent implements OnInit {

  vendorStaffForm: FormGroup;
  vendorStaffFormSubmitted = false;
  adminId:any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private vendorService : ManageVendorService
  ) { }

  ngOnInit(): void {
    this.adminId = JSON.parse(localStorage.getItem('currentUser'))?.referenceId;
    console.log(this.adminId)
    this.vendorStaffForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      mobileNo: [null, [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      confirmPassword: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      userRole: [null, [Validators.required]],
      password: [null, [Validators.required]],
      userId: [null],
      vendorId:[null]
      
    },
    {
      validator: MustMatch('password', 'confirmPassword'),
    }
  );
   
  }
  get f() {
    return this.vendorStaffForm.controls;
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  togglePasswordText() {
    this.passwordText = !this.passwordText;
  }
  onSubmit() {
    this.vendorStaffFormSubmitted = true;

    // if ((this.usersForm.value.password && this.usersForm.value.confirmPassword) && (this.usersForm.value.password != this.usersForm.value.confirmPassword)) {
    //   this.mustMatch = true;
    //   return;
    // }

    if (this.vendorStaffForm.invalid) {
      return;
    }
    this.vendorStaffForm.patchValue({
      vendorId:this.adminId
    })
    this.vendorService.vendorCreate(this.vendorStaffForm.value).pipe(first()).subscribe(res => {
      // this.toastr.success(res.message);
      this.router.navigate(['vendor/vendor-user']);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
  public passwordTextType: boolean
  public passwordText: boolean

}
