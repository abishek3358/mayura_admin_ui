import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ManageVendorService } from '../manage-vendor.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'app/auth/helpers/must-match.validator';

declare let $: any;
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  vendorObj: any = {};
  vendorArr: any = [];
  vendorId: any = {}
  vendorForm: FormGroup;
  passwordForm: FormGroup;
  updateVendor: FormGroup;
  passwordSubmitted = false;
  submitted = false;
  passwordTextType: boolean;
  passwordText: boolean;
  buttonText: string = "";
  passwordArr: any = [];
  venId: any;
  // uommArr: any = ["ACTIVE", "INACTIVE"];
  selectedTab: number = 1;

  selectedCar = 'ACTIVE';
  constructor(
    private manageVendorService: ManageVendorService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,


  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.vendorId = this.route.snapshot.params['id'];
    console.log(this.vendorId);
    this.getVendor();
    this.selectedTab = 1;

    this.passwordForm = this.formBuilder.group({
      userId: [null],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      userRole: [null, [Validators.required]],
      vendorId: [null]
    },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }),
      this.updateVendor = this.formBuilder.group({
        id: [null],
        emailId: [null, [Validators.required]],
        gstTaxNumber: [null, [Validators.required]],
        name: [null, [Validators.required]],
        phoneNumber: [null, [Validators.required]],
        vendorCode: [null, [Validators.required]],
        status: [null, [Validators.required]],
      })
  }
  get f() {
    return this.passwordForm.controls;
  }
  get b() {
    return this.updateVendor.controls;
  }
  getVendor() {

    $('#manage-table').DataTable().clear().destroy();
    this.manageVendorService.getVendor().pipe(first()).subscribe(res => {
      this.vendorArr = res.data;
      this.venId = res.data.id;
      this.getActive();
      this.getInActive();
      this.selectedTab = 1;
      $(document).ready(function () {
        $('#manage-table').DataTable({
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
  activeVendor: any[] = [];
  getActive() {
    this.selectedTab = 1;

    this.activeVendor = this.vendorArr.filter((res: any) => res.status == "ACTIVE");
    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    });
  }
  inActiveVendor: any[] = [];
  getInActive() {
    this.selectedTab = 2;
    this.inActiveVendor = this.vendorArr.filter((res: any) => res.status == "INACTIVE");
    console.log(this.inActiveVendor);

    if ($.fn.DataTable.isDataTable('#inActive')) {
      $('#inActive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inActive').DataTable({
        "iDisplayLength": 25
      });
    });
  }
  openDeleteVendor(VendorModalId, id) {
    this.modalService.open(VendorModalId, { size: 'md' })
    this.vendorId = id
  }
  vendorUpdateId: any;
  singleVendor: any = [];
  update(VendorModalId, id) {
    this.modalService.open(VendorModalId, { size: 'md' })
    this.vendorUpdateId = id;
    this.passwordSubmitted = false;
    this.manageVendorService.singleVendor(this.vendorUpdateId).pipe(first()).subscribe((res: any) => {
      console.log(res);
      this.singleVendor = res.data;
      this.updateVendor.patchValue({
        id: res.data.id,
        emailId: res.data.emailId,
        gstTaxNumber: res.data.gstTaxNumber,
        name: res.data.name,
        phoneNumber: res.data.phoneNumber,
        vendorCode: res.data.vendorCode,
        status: res.data.status
      })
    })
  }
  openCreatePassword(createPassword, id) {
    this.buttonText = "Submit";
    this.passwordForm.reset({});
    this.passwordSubmitted = false;
    this.modalService.open(createPassword, { size: 'md' })
    this.vendorId = id
    console.log(this.vendorId)
  }
  delete(modal) {
    this.manageVendorService.deleteVendor(this.vendorId).pipe(first()).subscribe(res => {
      this.getVendor();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss('cross click');
      this.toastr.error(err.error.error.reason);
    })
  }
  onSubmit(modal) {
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.passwordForm.patchValue({
      vendorId: this.vendorId
    })
    this.manageVendorService.vendorCreate(this.passwordForm.value).pipe(first()).subscribe(res => {
      this.passwordArr = res.data;
      this.toastr.success(res.data);
      modal.dismiss("cross click")
    },
      err => {
        modal.dismiss('cross click');
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  onUpdate(modal: any) {
    this.passwordSubmitted = true;
    if (this.updateVendor.invalid) {
      return;
    } else {
      let obj = this.updateVendor.value;
      obj.status = this.updateVendor.value.status;
      this.manageVendorService.updateVendor(obj).pipe(first()).subscribe((res: any) => {
        this.toastr.success(res.data);
        this.getVendor();
        modal.dismiss('cross click');
      })
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  togglePasswordText() {
    this.passwordText = !this.passwordText;
  }
  // openModal(content: any) {
  //   this.buttonText = "Submit";
  //   this.uomForm.reset({});
  //       this.uomObj = {};
  //       this.uomForm.patchValue({
  //         status:"ACTIVE"
  //       })
  //       this.uomObj.status ="ACTIVE"
  //   this.uomSubmitted = false;
  //   this.modalService.open(content, { size: 'md' });
  // }
  editVendor(id) {
    this.router.navigate(['admin/vendor-management/vendors/{{vendorObj.id}}']);
  }

}

