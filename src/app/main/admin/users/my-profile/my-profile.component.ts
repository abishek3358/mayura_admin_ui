import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagePasswordService } from '../../manage-password/manage-password.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'app/auth/helpers/must-match.validator';
import { ManageUserService } from '../manage-user.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  usersProfileForm: FormGroup;
  usersFormSubmitted = false;
  resetPasswordForm: FormGroup;
  submitted = false;
  oldPasswordTextType: boolean;
  newPasswordTextType: boolean;
  confirmPasswordTextType: boolean;
  activeTab: number = 1; // Initialize activeTab to show the active tab
  modalRef: NgbModalRef;
  userDeatails: any;
  constructor(private formBuilder: FormBuilder, private managePasswordService: ManagePasswordService,
    private router: Router, private toastr: ToastrService, private manageUserService: ManageUserService
    , private modalService: NgbModal, public activeModal: NgbActiveModal,
    private authService: AuthService,
  ) { 
    this.manageUserService.currentUser.subscribe((user) => {
      this.userDeatails = user;      
    });
  }

  ngOnInit(): void {
    //this.userDeatails = JSON.parse(localStorage.getItem('currentUser')) || [];

    this.usersProfileForm = this.formBuilder.group({
      id: [null],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      mobileNo: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      userRole:[null],
      status: "ACTIVE"
    })
    this.resetPasswordForm = this.formBuilder.group(
      {
        oldPassword: [null, Validators.required],
        newPassword: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: MustMatch("newPassword", "confirmPassword"),
      }
    );
    this.usersProfileForm.patchValue({
      fullName: this.userDeatails.fullName,
      email: this.userDeatails.email,
      mobileNo: this.userDeatails.phone,
      userRole: this.userDeatails.roleObj.roleName
    })
    this.userDetail();
  }
  get f() {
    return this.usersProfileForm.controls;
  }

  getActive(tabId: number) {
    this.activeTab = tabId;
  }

  getExpiry(tabId: number) {
    this.activeTab = tabId;
    this.resetPasswordForm.reset({});
    this.submitted = false;
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  userDetail() {
    this.authService.userDetail().pipe(first()).subscribe(res => {
      res.data.loginObj.value = {
        role: "Admin"
      }
      res.data.loginObj.role = "Admin";
      res.data.loginObj.avatar = "avatar-s-8.jpg";
      // res.data.loginObj.token = "fake-jwt-token.1"
      // this.loading = false;
      this.manageUserService.updateCurrentUser(res.data.loginObj);
      console.log(res.data.loginObj);
      
      this.router.navigate(['/dashboard'])
        .then(() => {
          // window.location.reload();
        });
      // this.router.navigate(['/dashboard/ecommerce']);
    }, err => {
      this.toastr.error(err.error.error.reason);
    })
  }

  onSubmit() {
    this.usersFormSubmitted = true;
    if (this.usersProfileForm.invalid) {
      return;
    } else {
      let obj = this.usersProfileForm.value;
      obj.id = this.userDeatails.userId;
      this.manageUserService.profileUpdate(this.usersProfileForm.value).pipe(first()).subscribe((res: any) => {
        this.userDetail();
        this.activeModal.dismiss();
        this.toastr.success(res.data);
      },(err:any)=>{
        this.toastr.error(err.error.error.reason)
      })
    }
  }

  get p() {
    return this.resetPasswordForm.controls;
  }

  toggleoldPasswordTextType() {
    this.oldPasswordTextType = !this.oldPasswordTextType;
  }

  togglenewPasswordTextType() {
    this.newPasswordTextType = !this.newPasswordTextType;
  }

  toggleconfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  onPasswordSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.managePasswordService
      .updateChangePassword(this.resetPasswordForm.value)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.router.navigate(["/login"]);
          this.toastr.success(res.data);
          this.activeModal.dismiss();
        },
        (err) => {
          this.toastr.error(err.error.error.reason);
        }
      );
  }
}
