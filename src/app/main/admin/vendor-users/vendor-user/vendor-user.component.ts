import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageVendorService } from '../../vendor management/manage-vendor.service';
declare let $: any
@Component({
  selector: 'app-vendor-user',
  templateUrl: './vendor-user.component.html',
  styleUrls: ['./vendor-user.component.scss']
})
export class VendorUserComponent implements OnInit {
  vendorUserForm: FormGroup;
  buttonText: string = "";
  vendorUserSubmitted = false;
  vendorUserArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private vendorService: ManageVendorService
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.vendorUserForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      id: [null],
    })
    this.vendorGet();
  }
  openModal(modal: any) {
    this.modalService.open(modal, { size: 'sm' });
    this.buttonText = "Change";
    this.vendorUserForm.reset({});
    this.vendorUserSubmitted = false;
  }
  get f() {
    return this.vendorUserForm.controls;
  }
  onSubmit(modal) {
    this.vendorUserSubmitted = true;
    if (this.vendorUserForm.invalid) {
      return;
    }
    // this._userService.changePassword(this.vendorUserForm.value).pipe(first()).subscribe(res => {
    //   modal.dismiss("cross click")
    // })
  }
  // getUser() {    
  //   $('#user-table').DataTable().clear().destroy();
  //   this._userService.getUser().pipe(first()).subscribe(res => {
  //     this.userArr = res.data
  //     $(document).ready(function () {
  //       $('#user-table').DataTable({
  //         "iDisplayLength": 25
  //       });
  //     });
  //     this.spinner.hide();
  //     this.toastr.success(res.message);
  //   }, err => {
  //     this.spinner.hide();
  //     this.toastr.error(err);
  //   })
  // }
  // getSingleUser(userId) {
  //   this._userService.getSingleUser(userId).pipe(first()).subscribe(res => {

  //   },
  //   err => {
  //     this.spinner.hide();
  //     this.toastr.error(err.error.error.reason);
  //   })
  // }
  // OpenDeleteUser(usersModalId,userId)
  // {
  //   this.modalService.open(usersModalId, { size: 'md' });
  //   this.id = userId;    
  // }
  // deleteUser(modal) {
  //      this.spinner.show();
  //   this._userService.deleteUser(this.id).pipe(first()).subscribe(res => {
  //      this.getUser();
  //     modal.dismiss('cross click');
  //     this.toastr.success(res.data);
  //   }, err => {
  //     modal.dismiss('cross click');
  //     this.spinner.hide();
  //     this.toastr.error(err.error.error.reason);
  //   })
  // }
  vendorGetAll: any = [];
  vendorGet() {
    $('#user-table').DataTable().clear().destroy();
    this.vendorService.vendorGet().pipe(first()).subscribe(res => {
      this.toastr.success(res.message);
      this.vendorGetAll = res.data;
      this.vendorUserArr = this.vendorGetAll.filter((res:any)=>res.userType == "VENDOR_STAFF");
      $(document).ready(function () {
        $('#user-table').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
    }, err => {

      this.toastr.error(err);
    });
  }
}


