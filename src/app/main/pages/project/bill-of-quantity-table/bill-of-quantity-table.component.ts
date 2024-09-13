import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BillOfQuantityService } from '../bill-of-quantity/bill-of-quantity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
declare let $: any;
@Component({
  selector: 'app-bill-of-quantity-table',
  templateUrl: './bill-of-quantity-table.component.html',
  styleUrls: ['./bill-of-quantity-table.component.scss']
})
export class BillOfQuantityTableComponent implements OnInit {
  boqArr: any = [];
  boqId = '';
  modalForm: FormGroup;
  submitted = false;
  downloadList: any = {
    id: null,
    billOfQuantityUploadDTOList: []
  };

  billOfQuantityId= "";
  freezeboqId= "";
  constructor(
    private BillOfQuantityService: BillOfQuantityService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      billOfQuantityUploadDTOList: this.fb.array([this.formGroup()]),
    })
    this.spinner.show();
    this.getBoq();
    console.log(Array.isArray(this.form.controls))
    
  }
  get form(): FormArray { return this.modalForm.get('billOfQuantityUploadDTOList') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['' ,Validators.required],
      fileName: ['' ,Validators.required],
      fileBase64:[null],
      billOfQuantityId:[null],
      id:[null]
    })
  }
  freeze(modal,id){

    this.modalService.open(modal,{size:'md'});
    this.freezeboqId = id;
  }
  freezeBillOfQuantity(modal){
    this.spinner.show();
    this.BillOfQuantityService.freezeBoq(this.freezeboqId).pipe(first()).subscribe(res => {
      this.getBoq();
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  openModal(modal,id,list) {
    this.form.controls = [];
    this.downloadList.billOfQuantityUploadDTOList = [];
    for(let item of list){
      this.downloadList.billOfQuantityUploadDTOList.push(item)
    }
    // this.downloadList.billOfQuantityUploadDTOList = list;
    this.form.push(this.formGroup());
    this.submitted = false;
    this.billOfQuantityId = id;
    this.modalService.open(modal, { size: 'md' });
  }
  addRow() {
    this.form.push(this.formGroup());
  }
  rowSubmit(modal) {
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        billOfQuantityId: this.billOfQuantityId
      })
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.billOfQuantityUploadDTOList.push(this.form.value[i]);
      }
    }
    this.spinner.show();
    this.BillOfQuantityService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getBoq();
      console.log('res',res)
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      //this.Toastr.error(err.error.error.reason);
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
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (() => {
        this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
        console.log(this.modalForm.value)
      });
      
    }
    deleteFile(index) {
      this.downloadList.billOfQuantityUploadDTOList.splice(index, 1);
    }
  getBoq() {
    this.spinner.show();
    $('#billOfQuantityTable').DataTable().clear().destroy()
    this.BillOfQuantityService.getBoq().pipe(first()).subscribe(res => {
      this.boqArr = res.data;
      $(document).ready(function () {
        $('#billOfQuantityTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  };
  editBoq(id) {
    this.router.navigate(['app/project/bill/of/quantity' + '/' + id])
  }
  boqView(id) {
    this.router.navigate(['app/project/bill/of/quantity/view' + '/' + id])
  }
  download(id) {
    //window.open = environment.apiUrl
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/document/download/get/' + id);
    win.focus();
    this.spinner.hide();
    //this.BillOfQuantityService.download(id).pipe(first()).subscribe(res => {

    //})
  }
  deleteModal(content, boqId) {
    this.modalService.open(content, { size: 'md' });
    this.boqId = boqId;
  }
  deleteBoq(modal) {
    this.spinner.show();
    this.BillOfQuantityService.deleteBoq(this.boqId).pipe(first()).subscribe(res => {
      this.getBoq();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.message);
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
  fileDownload(modal,download) {
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/bill/of/quantity/download/' + download.billOfQuantityId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
