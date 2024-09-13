import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SubContractorBillService } from './sub-contractor-bill.service';
import { environment } from 'environments/environment';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';


declare let $:any;
@Component({
  selector: 'app-sub-contractor-bill',
  templateUrl: './sub-contractor-bill.component.html',
  styleUrls: ['./sub-contractor-bill.component.scss']
})
export class SubContractorBillComponent implements OnInit {
  scBillArr: any = [];
  scBillId: any = '';
  modalForm: FormGroup;
  subContractorBillId = "";
  submitted = false;
  downloadList: any = {
    id: null,
    subContractorBillFileuploadDTOList: []
  };
  
 
  constructor(
    private ScBillService: SubContractorBillService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      subContractorBillFileuploadDTOList: this.fb.array([this.formGroup()]),
    })
    this.spinner.show();
    this.getscBill();
  }
  get form(): FormArray { return this.modalForm.get('subContractorBillFileuploadDTOList') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['' ,Validators.required],
      fileName: ['' ,Validators.required],
      fileBase64:[null],
      subContractorBillId:[null],
      id:[null]
    })
  }
  viewSubContract(id){
    this.router.navigate(['app/sub/contractor/bill/view/'  + id])
  }
 
  openModal(modal,id,list) {
    this.form.controls = [];
    this.downloadList.subContractorBillFileuploadDTOList = [];
    for(let item of list){
      this.downloadList.subContractorBillFileuploadDTOList.push(item)
    }
    this.form.push(this.formGroup());
    this.submitted = false;
    this.subContractorBillId = id; 
    this.modalService.open(modal, { size: 'md' });
  }
  addRow() {
    this.form.push(this.formGroup());
  }
  freeze(content,id){

    this.modalService.open(content,{size:'md'});
    this.scBillId = id;
  }
  freezeSubContract(modal){
    this.spinner.show();
    this.ScBillService.freezeSCBill(this.scBillId).pipe(first()).subscribe(res => {
      modal.dismiss("Cross Click");
      this.getscBill();
      this.spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  rowSubmit(modal){
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        subContractorBillId: this.subContractorBillId
      });
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.subContractorBillFileuploadDTOList.push(this.form.value[i]);
      }
    }
 
    this.spinner.show();
    this.ScBillService.Upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getscBill();
      console.log('es',res)
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
    modal.dismiss("cross click");
  }
  getscBill() {
    $('#sub-contract').DataTable().clear().destroy();
    this.ScBillService.scGet().pipe(first()).subscribe(res => {
      this.scBillArr = res.data;
      $(document).ready(function () {
        $('#sub-contract').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  edit(id) {
    this.spinner.show();
    this.router.navigate(['app/sub/contractor/bill/' + id])
  }
  deleteFile(index) {
    this.downloadList.subContractorBillFileuploadDTOList.splice(index, 1);
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
  onFileChange(event, index) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (() => {
      this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
      console.log(this.modalForm.value)
    });
  }
 
  
  deleteModal(content, id) {
    this.modalService.open(content, { size: 'md' });
    this.scBillId = id
  }
  recordPayment(id){
    this.spinner.show();
    this.router.navigate(['app/sub/contractor/bill/payment/' + id])
  }
  deleteSubContract(modal) {
    this.spinner.show();
    this.ScBillService.scBillDelete(this.scBillId).pipe(first()).subscribe(res => {
      this.getscBill();
      this.Toastr.success(res.data);
      modal.dismiss("Cross Click");
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason)
    })
  }
 
  downloadOpenModal(content, list) {
    this.modalService.open(content, { size: 'md' })
    this.downloadList = list;
    console.log(list)
  }
  fileDownload(modal,download) {
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/sub/contractor/bill/download' + '/' + download.subContractorBillId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
