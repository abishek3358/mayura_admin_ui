import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { MaterialService } from './material.service';

declare let $: any;
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  materialForm: FormGroup;
  materialDtlArr: any = [];
  buttonText: string = " ";
  submitted = false;
  materialId ="";
  constructor(
    private materialService: MaterialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      id:[null]
    });
    this.getMaterial();
  }
  get f() { return this.materialForm.controls; }
  getMaterial() {

    this.materialService.getMaterial().pipe(first()).subscribe(res => {
      this.materialDtlArr = res.data;
      $('#materialTable').DataTable().clear().destroy();
      $(document).ready(function () {
        $('#materialTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }), err => {
      this.toastr.error(err.error.error.reason);
      this.spinner.hide();
    }
  }
  materialModal(modal: any) {
    this.buttonText = 'Submit';
    this.materialForm.reset({});
    this.submitted = false;
    this.modalService.open(modal, { size: 'sm' });
  }
  submit(modal) {
    this.submitted = true;
    this.buttonText = "Submit";
    if (this.materialForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.materialForm.value.id) {
      this.materialService.updateMaterial(this.materialForm.value).pipe(first()).subscribe(res => {
        modal.dismiss("cross click");
        this.getMaterial();
        this.spinner.hide();
        this.toastr.success(res.data);
      }, err => {
        modal.dismiss('cross click');
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);

      });
    } else {
      this.materialService.createMaterial(this.materialForm.value).pipe(first()).subscribe(res => {
        this.getMaterial();
        modal.dismiss("cross click");
        this.spinner.hide();
        this.toastr.success(res.data);
       
      }, err => {
        modal.dismiss('cross click');
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);

      });
    }

  }
  editMaterial(modal, material) {
    this.submitted = false;
    this.buttonText = "Update";

    this.materialForm.patchValue({
      name: material.name,
      shortName: material.shortName,
      id: material.id
    });
    this.modalService.open(modal, { size: 'sm' });

  }
  deletemodal(modal,material){
    this.modalService.open(modal, { size: 'md' });
    this.materialId = material.id;
  }
  delete(modal) {
    this.spinner.show();
    this.materialService.deleteMaterial(this.materialId).pipe(first()).subscribe(res => {
      this.getMaterial();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
}
