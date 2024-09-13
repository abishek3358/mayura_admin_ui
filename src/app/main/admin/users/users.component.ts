import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserService } from '../users/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

declare let $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  buttonText: string = "";
  usersForm: FormGroup;
  usersSubmitted = false;
  userArr: any = [];
  users: any = {};
  userObj: any = {};
  roleObj: any = {};
  inActiveUser: any = [];
  id: any;
  userId: any;
  selectedCar = 'ACTIVE';
  selectedTab: number = 1;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _userService: ManageUserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.usersForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      id: [null],
    })
    this.usersForm = this.formBuilder.group({
      id: [null],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      mobileNo: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      userRole: [null, [Validators.required]],
      status: [null, [Validators.required]],
    })
    this.getUser();
    this.selectedTab = 1;
  }
  openModal(modal: any) {
    this.modalService.open(modal, { size: 'sm' });
    this.buttonText = "Change";
    this.usersForm.reset({});
    this.usersSubmitted = false;
  }
  get f() {
    return this.usersForm.controls;
  }
  onSubmit(modal) {
    this.usersSubmitted = true;
    if (this.usersForm.invalid) {
      return;
    }
    this._userService.changePassword(this.usersForm.value).pipe(first()).subscribe(res => {
      modal.dismiss("cross click")
    })
  }
  getAllUser: any = []
  getUser() {
    $('#user-table').DataTable().clear().destroy();
    this._userService.getUser().pipe(first()).subscribe((res: any) => {

      this.getAllUser = res.data;
      // this.onChange();
      this.getActive();
      this.getInActive();
      this.selectedTab = 1;

      $(document).ready(function () {
        $('#user-table').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err);
    })
  }

  activeUser: any[] = [];
  getActive() {
    this.selectedTab = 1;
    this.activeUser = this.getAllUser.filter((res: any) => res.status == "ACTIVE");
    console.log(this.activeUser);
    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    });
  }
  // inActiveUser: any[] = [];
  getInActive() {
    this.selectedTab = 2;
    this.inActiveUser = this.getAllUser.filter((res: any) => res.status == "INACTIVE");
    console.log(this.inActiveUser);
    if ($.fn.DataTable.isDataTable('#inactive')) {
      $('#inactive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inactive').DataTable({
        "iDisplayLength": 25
      });
    });
  }

  // onChange() { 
  //   this.userArr = this.getAllUser.filter((res:any)=>res.status == this.selectedCar);
  // }
  getSingleUser(userId) {
    this._userService.getSingleUser(userId).pipe(first()).subscribe(res => {

    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  OpenDeleteUser(usersModalId, userId) {
    this.modalService.open(usersModalId, { size: 'md' });
    this.id = userId;
  }
  deleteUser(modal) {
    this.spinner.show();
    this._userService.deleteUser(this.id).pipe(first()).subscribe((res: any) => {
      this.getUser();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss('cross click');
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  userInActiveId: any;
  onEdit(id: any, modal: any) {
    this.userInActiveId = id;
    this.modalService.open(modal, { size: 'sm' });
    this._userService.userEdit(this.userInActiveId).subscribe((res) => {
      console.log(res);
      this.usersForm.patchValue({
        id: res.data.userId,
        fullName: res.data.fullName,
        email: res.data.email,
        mobileNo: res.data.mobileNo,
        userName: res.data.userName,
        userRole: res.data.userRole,
        status: res.data.status,
      });

    });
    this.buttonText = "Update"
  }
  onUpdate(modal: any) {
    this.usersSubmitted = true;
    if (this.usersForm.invalid) {
      return;
    }
    else {
      this._userService.profileUpdate(this.usersForm.value).subscribe((res) => {
        this.toastr.success(res.data);
        modal.dismiss('cross click');
        this.getUser();
      });
    }
  }
}