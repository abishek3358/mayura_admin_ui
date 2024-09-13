import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice/invoice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from "ngx-spinner";
import { first } from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { environment } from 'environments/environment';
declare let $: any;

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  invoiceArr:any = [];
  invoiceId= "";
  modalForm: FormGroup;
  submitted = true;
  salesInvoiceId= "";
  footValue:any={
    invoiceTotal:0,
    paidAmount:0,
  }

  downloadList: any = {
    id: null,
    salesInvoiceUploadDTOList: []
  };
  
 
  
  constructor(
    private invoiceService: InvoiceService,
    private router: Router, 
    private Toastr: ToastrService,
    private Spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
 
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      salesInvoiceUploadDTOList: this.fb.array([this.formGroup()]),
    })
    this.Spinner.show();
    this.getInvoice();

  }
  get form(): FormArray { return this.modalForm.get('salesInvoiceUploadDTOList') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['' ,Validators.required],
      fileName: ['' ,Validators.required],
      fileBase64:[null, Validators.required],
      salesInvoiceId: [null],
      id:[null]
    })
  }
  freeze(content,id){

    this.modalService.open(content,{size:'md'});
    this.invoiceId = id;
  }
  freezeInvoices(modal){
    this.Spinner.show();
    this.invoiceService.freezeInvice(this.invoiceId).pipe(first()).subscribe(res => {
      this.getInvoice();
      modal.dismiss("Cross Click");
      this.Spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  openModal(modal,id,list) {
    this.form.controls = [];
    this.downloadList.salesInvoiceUploadDTOList = [];
    for(let item of list){
      this.downloadList.salesInvoiceUploadDTOList.push(item)
    }
    // this.downloadList.salesInvoiceUploadDTOList = list;
    this.form.push(this.formGroup());
    this.submitted = false;
    this.salesInvoiceId = id;
    this.modalService.open(modal, { size: 'md' });
  }
  addRow() {
    this.form.push(this.formGroup());
  }
  rowSubmit(modal) {
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        salesInvoiceId: this.salesInvoiceId
      })
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.salesInvoiceUploadDTOList.push(this.form.value[i]);
      } 
    }

    this.Spinner.show();
    this.invoiceService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getInvoice();
      console.log('res',res)
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.Toastr.error(err.error.error.reason);
      this.Spinner.hide();
    });
    

    modal.dismiss("cross click");
  
  }
  deleteRow(index){
    if(this.form.length == 1){

      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return;
    }else{
      this.form.removeAt(index)
      this.Toastr.warning('Row deleted successfully', 'Delete row');
    }
  }
  onFileChange(event,index){
    console.log(event)
      const salesInvoice = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(salesInvoice);
      reader.onload = (() => {
        this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
        console.log(this.modalForm.value)
      });
      
    }
  getInvoice() {
    $('#invoice-table').DataTable().clear().destroy();

    this.invoiceService.getInvoice().pipe(first()).subscribe(res => {
      this.invoiceArr = res.data;
      for(let invoice of this.invoiceArr){
        this.footValue.invoiceTotal += invoice.totalAmount;
        this.footValue.paidAmount +=  invoice.receivedAmount;
      }
      $(document).ready(function () {
        $('#invoice-table').DataTable({
          "iDisplayLength": 100
        });
      });

      this.Spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err);
    });
  }


  deleteConfirmation(modal,invoice){
  this.modalService.open(modal,{size:'md'});
  this.invoiceId = invoice.id;
}
deleteFile(index) {
  this.downloadList.salesInvoiceUploadDTOList.splice(index, 1);
}
  deleteInvoice(modal) {
    this.Spinner.show();
    this.invoiceService.deleteInvoice(this.invoiceId).pipe(first()).subscribe(res => {
      this.getInvoice();
      modal.dismiss("cross click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  editInvoice(id) {
    this.Spinner.show();
    this.router.navigate(['app/accounts/invoice' + '/' + id]);
  }

  viewInvoice(id) {
    this.router.navigate(['app/accounts/invoice/view' + '/' + id]);
  }
  recordPayment(id) {
    this.router.navigate(['app/accounts/invoice/record/payment/' + id])
  }
  downloadOpenModal(content, list) {
    this.modalService.open(content, { size: 'md' })
    this.downloadList = list;
    console.log(list)
  }
  fileDownload(modal,download) {
    this.Spinner.show();
    var win = window.open(environment.apiUrl + 'api/sales/invoice/download' + '/' + download.salesInvoiceId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.Spinner.hide();
  }
}
