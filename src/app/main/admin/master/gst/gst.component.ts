import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GstService } from '../gst.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner'

declare let $: any;

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.scss']
})
export class GstComponent implements OnInit {
  gstForm: FormGroup;
  gstSubmitted = false;
  buttonText: string = "";
  gstObj: any = {};
  gstTest = "ACTIVE"
  selectedTab: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private gstService: GstService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.gstForm = this.formBuilder.group({
      name: [null, Validators.required],
      gst: [null, Validators.required],
      cgst: [null, Validators.required],
      sgst: [null, Validators.required],
      igst: [null, Validators.required],
      description: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      id: [null]
    });

    this.getGst();
    this.selectedTab = 1;

  }
  openModal(content: any) {
    this.gstForm.reset({});
    this.gstObj = {};
    this.gstForm.patchValue({
      status: "ACTIVE"
    })

    this.gstObj.status = "ACTIVE"
    this.gstSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
    this.buttonText = "Submit"
  }
  get f() {
    return this.gstForm.controls
  }
  // get method //
  gstListArr: any = []
  getGst() {
    $('#example').DataTable().clear().destroy();
    this.gstService.getGst().pipe(first()).subscribe(res => {
      this.gstListArr = res.data;
      this.onHide()
      this.onTest();
      this.selectedTab = 1;

      this.toastr.success(res.message);
      // $(document).ready(function () {
      //   $('#example').DataTable({
      //     "iDisplayLength": 25
      //   });
      // });
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }

  hideGst: any[] = []
  onHide() {
    this.selectedTab = 1;

    this.hideGst = this.gstListArr.filter((res: any) => res.status === 'ACTIVE');

    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    });


  }
  masterGst: any[] = []
  onTest() {
    this.selectedTab = 2;

    this.masterGst = this.gstListArr.filter((res: any) => res.status === 'INACTIVE');

    if ($.fn.DataTable.isDataTable('#inActive')) {
      $('#inActive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inActive').DataTable({
        "iDisplayLength": 25
      });
    });


  }

  // submit method //
  submit(modal) {
    this.gstSubmitted = true;
    if (this.gstForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.gstForm.value.id) {
      this.gstService.updateGst(this.gstForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data)
        this.getGst();
        modal.dismiss("cross click");
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      });
    } else {
      this.gstService.createGst(this.gstForm.value).pipe(first()).subscribe(res => {
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        });
      modal.dismiss("cross click");
      this.getGst();
    }
  }
  gstModal(content: any) {
    this.buttonText = "Submit";
    this.gstForm.reset({});
    this.gstSubmitted = false;
    this.modalService.open(content, { size: 'md' });
  }
  // get f() {
  //   return this.gstForm.controls;
  // }
  // edit method //
  editGst(content: any, id) {
    this.gstService.getSingleGst(id).pipe(first()).subscribe(res => {
      this.gstForm.patchValue({
        name: res.data.name,
        gst: res.data.gst,
        cgst: res.data.cgst,
        sgst: res.data.sgst,
        igst: res.data.igst,
        description: res.data.description,
        status: res.data.status,
        id: res.data.id
      })
    })
    this.buttonText = "Update"
    this.modalService.open(content, { size: 'sm' });
  }

}
