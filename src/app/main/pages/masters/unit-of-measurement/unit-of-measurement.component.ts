import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner"
declare let $: any;
@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss']
})
export class UnitOfMeasurementComponent implements OnInit {
  uomForm: FormGroup;
  buttonText: string = "";
  uomSubmitted = false;
  uomArr: any = [];
  uomId = '';
  constructor(private bulid: FormBuilder, private modalservice: NgbModal,
    private apiservice: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.uomForm = this.bulid.group({

      name: [null, Validators.required],
      shortName: [null, Validators.required],
      id: [null]
    })
    this.getuom();
  }
  getuom() {
    $('#Uom').DataTable().clear().destroy();
    this.apiservice.getuommethod().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#Uom').DataTable({
          "iDisplayLength": 100
        })
      });
      this.uomArr = res.data;
      this.toastr.success(res.message);
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      }
    )
  }
  openModal(content: any) {
    this.buttonText = "Submit";
    this.uomForm.reset({});
    this.uomSubmitted = false;
    this.modalservice.open(content, { size: 'sm' });
  }

  onSubmit(modal) {
    this.uomSubmitted = true;
    if (this.uomForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.uomForm.value.id) {
      this.apiservice.updateuommethod(this.uomForm.value).pipe(first()).subscribe(res => {
        this.getuom();
        modal.dismiss("cross click")
        this.toastr.success(res.data);
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
    else {
      this.apiservice.createuommethod(this.uomForm.value).pipe(first()).subscribe(res => {
        this.getuom();
        this.toastr.success(res.data);
        modal.dismiss("cross click");
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
  }
  edituom(uom, content) {
    this.uomForm.reset({});
    this.uomSubmitted = false;
    this.buttonText = "Update";
    this.uomForm.patchValue({
      name: uom.name,
      shortName: uom.shortName,
      id: uom.id
    })
    this.modalservice.open(content, { size: 'sm' });
  }
  get f() {
    return this.uomForm.controls
  };
  deleteModal(content,uom){
    this.modalservice.open(content, { size: 'md' });
    this.uomId = uom.id;
  }
  delete(modal) {
    this.spinner.show();
    this.apiservice.deleteuommethod(this.uomId).pipe(first()).subscribe(res => {
      this.getuom();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

}

