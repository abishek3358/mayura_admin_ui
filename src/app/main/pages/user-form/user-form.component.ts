import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { first, map } from 'rxjs/operators';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userFormSubmitted = false;
  private stepper: Stepper;
  userArr: any = [];
  mustMatch = false;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private ActivatedRoute: ActivatedRoute,
    private Toastr: ToastrService,
    private route: Router,
    private Spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      userType: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      userId: [null],

    });
    if (this.ActivatedRoute.snapshot.params['id']) {
      this.getSingleUser(this.ActivatedRoute.snapshot.params['id']);
    }


  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.userFormSubmitted = true;
    if ((this.userForm.value.password && this.userForm.value.confirmPassword) && (this.userForm.value.password != this.userForm.value.confirmPassword)) {
      this.mustMatch = true;
      return;
    }
    if (this.userForm.invalid) {
      return;
    }
    this.Spinner.show();
    if (this.userForm.value.id) {
      this.userservice.updateUser(this.userForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/user']);
      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.userservice.createUser(this.userForm.value).pipe(first()).subscribe(async res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/user']);

      }, err => {
        this.Spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  getSingleUser(userId) {

    this.userservice.getSingleUser(userId).pipe(first()).subscribe(res => {
      this.userArr = res.data;

      this.userForm.patchValue({
        confirmPassword: res.data.confirmPassword,
        userId: res.data.userId,
        email: res.data.email,
        fullName: res.data.fullName,
        password: res.data.password,
        phoneNo: res.data.phoneNo,
        userName: res.data.userName,
        userType: res.data.userType,

      });
      this.Spinner.hide();
      this.Toastr.success(res.message)
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

}
