import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './../employee/employee.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'environments/environment';

declare let $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  empArr: any = [];
  empId = '';
  submitted = false;
  modalForm: FormGroup;
  employeeId=""; 
  downloadList: any = {
    id: null,
    employeeFileUploadlist: []
  };
  constructor(private router: Router,
    private EmployeeService: EmployeeService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService:NgbModal,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
      this.modalForm = this.fb.group({
        employeeFileUploadlist: this.fb.array([this.formGroup()]),
    })
      this.spinner.show();
    this.getEmp();
  }
  get form(): FormArray { return this.modalForm.get('employeeFileUploadlist') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['' ,Validators.required],
      fileName: ['' ,Validators.required],
      fileBase64:[null],
      employeeId: [null],
      id:[null]
    })
  }
  openModal(modal,id ,list) {
    this.form.controls = [];
    this.employeeId = id;
    this.downloadList.employeeFileUploadlist = [];
    for(let item of list){
      this.downloadList.employeeFileUploadlist.push(item)
    }
    this.form.push(this.formGroup());
    this.submitted = false;
    this.modalService.open(modal, { size: 'md' });
  }
  addRow() {
    this.form.push(this.formGroup());
  }
  rowSubmit(modal) {
    console.log( this.downloadList.employeeFileUploadlist)
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        employeeId: this.employeeId
      })
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.employeeFileUploadlist.push(this.form.value[i]);
      }
    }
    this.spinner.show();
    this.EmployeeService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getEmp();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
      this.spinner.hide();
    }, err => {
      modal.dismiss("Cross Click");
      this.Toastr.error(err.error.error.reason);
      this.spinner.hide();
    });
    

    modal.dismiss("cross click");
  
  }
  onFileChange(event,index){
    console.log(event)
      const employeeFileUploadlist = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(employeeFileUploadlist);
      reader.onload = (() => {
        this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
        console.log(this.modalForm.value)
      });
      
    }
    deleteFile(index) {
      this.downloadList.employeeFileUploadlist.splice(index, 1);
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

  getEmp() {
  
    $('#empTable').DataTable().clear().destroy();
    this.EmployeeService.getEmp().pipe(first()).subscribe(res => {
      this.empArr = res.data;
      $(document).ready(function () {
        $('#empTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    },err =>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  editEmp(id) {
    this.spinner.show();
    this.router.navigate(['app/project/employee' + '/' + id]);
  }
  deleteModal(content,empId){
    this.modalService.open(content,{size:'md'});
    this.empId = empId;
  }

  deleteEmp(modal) {
    this.spinner.show();
    this.EmployeeService.deleteEmp(this.empId).pipe(first()).subscribe(res => {
      this.getEmp();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
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
    var win = window.open(environment.apiUrl + 'api/employee/file/download'+ '/' + download.employeeId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
