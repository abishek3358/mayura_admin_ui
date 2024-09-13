import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetserviceService } from './assetservice.service';
import { first } from 'rxjs/operators';
import { AssettypeService } from '../asset-type/asset-type.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any;

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  assetTypeArr = [];
  assetArr = [];
  assetForm: FormGroup;
  assetSubmitted = false;
  buttonText = '';
  assetId = '';
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private assetService: AssetserviceService,
    private assetType: AssettypeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.assetForm = this.formBuilder.group({
      name: ['', Validators.required],
      assetTypeId: ['', Validators.required],
      assetCodeBooking: ['', Validators.required],
      assetQty: ['', Validators.required],
      assetAge: ['', Validators.required],
      assetValue: ['', Validators.required],
      cost: ['', Validators.required],
      costType: ['', Validators.required],
      description: ['', Validators.required],
      id: [null]
    });
    this.getAsset();
    this.getAssetType();

  }
  // Modal Open Function
  assetModel(modal: any) {
    this.buttonText = "Submit";
    this.assetForm.reset({});

    this.assetSubmitted = false;
    this.modalService.open(modal, { size: 'md' });
  }
  get f() { return this.assetForm.controls; }
  // Submit Function, Create and Update Function
  assetSubmit(modal) {
    this.assetSubmitted = true;
    if (this.assetForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.assetForm.value.id) {
      this.assetService.assetUpdate(this.assetForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getAsset();
        modal.dismiss('cross click');
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    } else {
      this.assetService.assetCreate(this.assetForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getAsset();
        modal.dismiss('cross click');
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }
  }
  // Edit Function
  assetEdit(modal, asset) {
    this.assetForm.reset({});
    this.assetSubmitted = false;
    this.buttonText = "Update";
    this.assetForm.patchValue({
      name: asset.name,
      assetTypeId: asset.assetTypeId,
      assetCodeBooking: asset.assetCodeBooking,
      assetQty: asset.assetQty,
      assetAge: asset.assetAge,
      assetValue: asset.assetValue,
      cost: asset.cost,
      costType: asset.costType,
      description: asset.description,
      id: asset.id
    });
    this.getAssetType();
    this.modalService.open(modal, { size: 'sm' });
  }

  // Get Function
  getAsset() {
    $('#assettable').DataTable().clear().destroy();
    this.assetService.assetGet().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#assettable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.assetArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
  // Get Asset Type
  getAssetType() {
    this.assetType.getAssetType().pipe(first()).subscribe(res => {
      this.assetTypeArr = res.data;
    }, err => {
      this.toastr.error(err.error.error.reason);
    });
  }
  deleteModal(content, asset) {
    this.assetId = asset.id;
    this.modalService.open(content, { size: 'md' });
  }

  // Delete Function
  assetDelete(modal) {
    this.spinner.show();
    this.assetService.assetDelete(this.assetId).pipe(first()).subscribe(res => {
      this.getAsset();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss('cross click');
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }

}
