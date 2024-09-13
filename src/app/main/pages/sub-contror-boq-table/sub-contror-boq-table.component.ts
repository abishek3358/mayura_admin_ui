import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SubContractorBoqService } from '../sub-contractor-boq/sub-contractor-boq.service';
import { environment } from 'environments/environment';
import { FormGroup, Validators, FormBuilder, FormArray,FormControl } from '@angular/forms';
declare let $:any;
@Component({
  selector: 'app-sub-contror-boq-table',
  templateUrl: './sub-contror-boq-table.component.html',
  styleUrls: ['./sub-contror-boq-table.component.scss']
})
export class SubControrBoqTableComponent implements OnInit {
  boqListArr: any = [];
  boqId: any = '';
  totalValue:number = 0;
  scBoqId:any = '';
  submitted  = false;
  modalForm : FormGroup;
  subContractorBoq = '';
  downloadList: any = {
    id: null,
    subContractorBoqFileUploadDTOList: []
  };
  
  constructor(
    private SCBoqService: SubContractorBoqService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      subContractorBoqFileUploadDTOList: this.fb.array([this.formGroup()]),
    });
    this.spinner.show();
    this.getBoqList();

  }
  get form(): FormArray { return this.modalForm.get('subContractorBoqFileUploadDTOList') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['' ,Validators.required],
      fileName: [null,Validators.required],
      file:[null,[Validators.required]],
      fileBase64:[null],
      subContractorBoqId:[null],
      id:[null]
    })
  }
  addRow(){
    this.form.push(this.formGroup());
  }
  openModal(modal,id,list) {
    this.form.controls = [];
    this.downloadList.subContractorBoqFileUploadDTOList = [];
    for(let item of list){
      this.downloadList.subContractorBoqFileUploadDTOList.push(item)
    }
    this.form.push(this.formGroup());
    this.submitted = false;
    this.subContractorBoq = id; 
    this.modalService.open(modal, { size: 'md' });
  }
  onFileChange(event,index) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (() => {
      this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
     
    });
  }
  freeze(modal,id){

    this.modalService.open(modal,{size:'md'});
    this.scBoqId = id;
  }
 
  freezeSubContractBoq(modal){
    this.spinner.show();
    this.SCBoqService.freezeScBoq(this.scBoqId).pipe(first()).subscribe(res => {
      this.getBoqList();
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
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
  rowSubmit(modal){
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        subContractorBoqId: this.subContractorBoq
      });
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.subContractorBoqFileUploadDTOList.push(this.form.value[i]);
      }
    }

    console.log( this.downloadList.subContractorBoqFileUploadDTOList);
    this.spinner.show();
    this.SCBoqService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getBoqList();
      console.log('es',res)
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
 
  }

  getBoqList() {
    $('#boq-table').DataTable().clear().destroy();
    this.SCBoqService.getBoq().pipe(first()).subscribe(res => {
      this.boqListArr = res.data;
      for(let boq of this.boqListArr){
        this.totalValue += boq.boqValue;
      }
      $(document).ready(function () {
        $('#boq-table').DataTable({
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
  deleteFile(index) {
    this.downloadList.subContractorBoqFileUploadDTOList.splice(index, 1);
  }
  editboq(id) {
    this.spinner.show();
    this.router.navigate(['app/sub/contractor/boq/' + id]);
  }
  deleteConfirmation(content, id) {
    this.boqId = id;
    this.modalService.open(content, { size: 'md' })
  }
  deleteItem(modal) {
    this.spinner.show();
    console.log(modal)
    this.SCBoqService.deleteSCBoq(this.boqId).pipe(first()).subscribe(res => {
      this.getBoqList();
        modal.dismiss('Cross click');
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss('Cross click');
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  downloadOpenModal(content, list) {
    this.modalService.open(content, { size: 'md' })
    this.downloadList = list;
    console.log(list)
  }
  fileDownload(modal,download) {
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/sub/contractor/boq/download' + '/' + download.subContractorBoqId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
