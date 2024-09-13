import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UomService } from '../uom.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})

export class UomComponent implements OnInit {
  uomSubmitted = false;
  uomForm: FormGroup;
  uomObj: any = {};
  buttonText: string = "";
  unitofMeasur = "ACTIVE";
  // uommArr: any = ["ACTIVE", "INACTIVE"];
  selectedTab: number = 1;

  uomId: any;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private uomService: UomService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.uomForm = this.formBuilder.group({
      name: [null, Validators.required],
      shortName: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      id: [null]
    });
    this.getUom();
    this.selectedTab = 1;

  }



  //GET//
  uomArr: any = [];

  getUom() {
    $('#Uom').DataTable().clear().destroy();
    this.uomService.getUom().pipe(first()).subscribe(res => {
      this.uomArr = res.data;
      this.onHide()
      this.inhideActive();
      this.selectedTab = 1;

      this.toastr.success(res.message);
      this.spinner.hide();
      // $(document).ready(function () {
      //   $('#Uom').DataTable({
      //     "iDisplayLength": 25
      //   })
      // });

    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      }
    )
  }
  displayUOM:any[]=[]
  onHide() {
    this.selectedTab = 1;

    this.displayUOM = this.uomArr.filter((res: any) => res.status === 'ACTIVE');
    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    });
  
   
  }
  displayActive:any[]=[]
  inhideActive(){
    this.selectedTab = 2;

    this.displayActive = this.uomArr.filter((res: any) => res.status === 'INACTIVE');
    if ($.fn.DataTable.isDataTable('#inActive')) {
      $('#inActive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inActive').DataTable({
        "iDisplayLength": 25
      });
    });
  
  }
  openModal(content: any) {
    this.buttonText = "Submit";
    this.uomForm.reset({});
    this.uomObj = {};
    this.uomForm.patchValue({
      status: "ACTIVE"
    })
    this.uomObj.status = "ACTIVE"
    this.uomSubmitted = false;
    this.modalService.open(content, { size: 'md' });
  }
  get f() {
    return this.uomForm.controls;
  }

  onSubmit(modal) {
    this.uomSubmitted = true;
    if (this.uomForm.invalid) {
      return;
    }

    //UPDATE//
    this.spinner.show();
    if (this.uomForm.value.id) {
      this.uomService.updateUom(this.uomForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        modal.dismiss("cross click")
        this.getUom();
      },
        err => {
          this.spinner.hide();
          modal.dismiss("cross click")
          this.toastr.error(err.error.error.reason);
        }
      );
    }

    //CREATE//
    else {
      this.uomService.createUom(this.uomForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        modal.dismiss("cross click");
        this.getUom();
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
  }
  //EDIT//
  editUom(myModal: any, id: any) {
    this.uomService.singleGetUom(id).pipe(first()).subscribe(res => {
      this.uomForm.patchValue({
        name: res.data.name,
        shortName: res.data.shortName,
        status: res.data.status,
        id: res.data.id,
      })
    })
    this.buttonText = "Update"
    this.modalService.open(myModal, { size: 'sm' });
  }

}
