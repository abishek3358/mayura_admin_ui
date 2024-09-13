import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../purchase-order-form/purchase-order.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'environments/environment';
declare let $: any;
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  modalForm: FormGroup;
  purchaseOrderArr: any = [];
  purchaseOrderId = '';
  submitted = false;
  totalPoValue: any = 0;
  totalPaidValue: any = 0;

  downloadList: any = {
    id: null,
    purchaseOrderFileUploadDTOlist: []
  };

  constructor(
    private PurchaseOrderService: PurchaseOrderService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.modalForm = this.fb.group({
      purchaseOrderFileUploadDTOlist: this.fb.array([this.formGroup()]),
    })

    this.getPurchaseOrder();
  }
  get form(): FormArray { return this.modalForm.get('purchaseOrderFileUploadDTOlist') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      fileName: ['', Validators.required],
      fileBase64: [null, Validators.required],
      purchaseOrderId: [null],
      id: [null]
    })
  }
  freeze(modal, id) {

    this.modalService.open(modal, { size: 'md' });
    this.purchaseOrderId = id;
  }
  freezePurchase(modal) {
    this.spinner.show();
    this.PurchaseOrderService.freezePo(this.purchaseOrderId).pipe(first()).subscribe(res => {
      modal.dismiss("Cross Click");
      this.getPurchaseOrder();
      this.spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  openModal(modal, id, list) {
    this.form.controls = []
    this.downloadList.purchaseOrderFileUploadDTOlist = [];
    for(let item of list){
      this.downloadList.purchaseOrderFileUploadDTOlist.push(item)
    }
    console.log(list, this.downloadList);
    this.form.push(this.formGroup());
    this.submitted = false;
    this.purchaseOrderId = id;
    this.modalService.open(modal, { size: 'md' });
  }
  addRow() {
    this.form.push(this.formGroup());
  }
  rowSubmit(modal) {
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        purchaseOrderId: this.purchaseOrderId
      })
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.purchaseOrderFileUploadDTOlist.push(this.form.value[i]);
      }
    }
    console.log(this.downloadList);
    this.spinner.show();
    this.PurchaseOrderService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getPurchaseOrder();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  recordPayment(id) {
    this.spinner.show();
    this.router.navigate(['app/project/purchase/order/record/payment/' + id]);
  }
  deleteFile(index) {
    this.downloadList.purchaseOrderFileUploadDTOlist.splice(index, 1);
  }
  deleteRow(index) {
    if (this.form.length == 1) {

      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return;
    } else {
      this.form.removeAt(index)
      this.Toastr.warning('Row deleted successfully', 'Delete row');
    }
  }
  onFileChange(event, index) {
    console.log(event)
    const purchaseArray = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(purchaseArray);
    reader.onload = (() => {
      this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
      console.log(this.modalForm.value)
    });

  }
  getPurchaseOrder() {

    $('#purchase-table').DataTable().clear().destroy();

    this.PurchaseOrderService.getPurchase().pipe(first()).subscribe(res => {
      this.purchaseOrderArr = res.data;
      for (let purchase of this.purchaseOrderArr) {
        this.totalPoValue += purchase.purchaseOrderValue;
        this.totalPaidValue += purchase.paidAmount
      }
      $(document).ready(function () {
        $('#purchase-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  editPurchase(id) {
    this.spinner.show();
    this.router.navigate(['app/project/purchase/order' + '/' + id]);
  }
  viewPurchase(id) {
    this.router.navigate(['app/project/purchase/order/view' + '/' + id])
  }
  deleteModal(content, purchaseOrderId) {
    this.modalService.open(content, { size: 'md' })
    this.purchaseOrderId = purchaseOrderId;
  }
  deletePurchase(modal) {
    this.spinner.show();
    this.PurchaseOrderService.deletePurchase(this.purchaseOrderId).pipe(first()).subscribe(res => {
      this.getPurchaseOrder();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
      this.spinner.hide()
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  downloadOpenModal(content, list) {
    this.modalService.open(content, { size: 'md' })
    this.downloadList = list;
    console.log(list)
  }
  fileDownload(modal, download) {
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/purchase/order/download/' + download.purchaseOrderId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
