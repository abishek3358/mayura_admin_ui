import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssettypeService } from './asset-type.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any;
@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.scss']
})
export class AssetTypeComponent implements OnInit {
  assetTypeForm !: FormGroup;
  assetTypeSubmitted = false;
  assetTypeArr = [];
  buttonText = '';
  assetTypeId = '';

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private assetType: AssettypeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.assetTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      id: [null]
    });
    this.getAssetType();
  }
  get f() { return this.assetTypeForm.controls; }
  // Modal Open Function
  assetTypeModal(modal: any) {
    this.buttonText = "Submit";
    this.assetTypeForm.reset({});

    this.assetTypeSubmitted = false;
    this.modalService.open(modal, { size: 'sm' });
  }
  // Submit,Create And Update Function
  assetSubmit(modal) {
    this.assetTypeSubmitted = true;
    if (this.assetTypeForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.assetTypeForm.value.id) {
      this.assetType.updateAssetType(this.assetTypeForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getAssetType();
        modal.dismiss('cross click');
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    } else {
      this.assetType.createAssetType(this.assetTypeForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getAssetType();
        modal.dismiss('cross click');
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }

  }
  //  Edit Function
  editAssetType(modal, assetType) {
    this.assetTypeForm.reset({});
    this.assetTypeSubmitted = false;
    this.buttonText = "Update";
    this.assetTypeForm.patchValue({
      name: assetType.name,
      description: assetType.description,
      id: assetType.id
    });
    this.modalService.open(modal, { size: 'sm' });
  }
  // Get Function
  getAssetType() {
    $('#assetTypeTable').DataTable().clear().destroy();
    this.assetType.getAssetType().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#assetTypeTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.assetTypeArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
  deleteConfirmation(modal, assetType){
    this.modalService.open(modal, { size: 'md' });
    this.assetTypeId = assetType.id;
  }
  // Delete Function
  delete(modal) {
    this.spinner.show();
    this.assetType.deleteAssetType(this.assetTypeId).pipe(first()).subscribe(res => {
      this.getAssetType();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      this.spinner.hide();
      modal.dismiss('cross click');
      this.toastr.error(err.error.error.reason);
    });
  }
}
