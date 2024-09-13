import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { ManageProjectService } from '../manage-project-form/manage-project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare let $: any;
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent implements OnInit {
  projectArr: any = [];
  projectId = '';
  totalCost: number = 0;
  totalGst: number = 0;
  modalForm: FormGroup;
  submitted = false;
  Id: any;
  downloadList: any = {
    id: null,
    workOrderFileUploadDTOList:[]
  };
  workOrderId: any = '';
  constructor(
    private spinner: NgxSpinnerService,
    private ManageProjectService: ManageProjectService,
    private Toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      id: [null],
      workOrderFileUploadDTOList: this.fb.array([this.formGroup()]),
    })
    this.spinner.show();
    this.getProject();
    // console.log("shive'this.'")
    console.log('form', this.modalForm)
  }

  get form(): FormArray { return this.modalForm.get('workOrderFileUploadDTOList') as FormArray; }
  formGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      fileName: ['', Validators.required],
      fileBase64: [null],
      projectId: [null, [Validators.required]],
      id: [null]
    })
  }
  openModal(modal, id, list) {
    this.form.controls = []
    this.form.push(this.formGroup());
    this.downloadList.workOrderFileUploadDTOList = [];
    for(let item of list){
      this.downloadList.workOrderFileUploadDTOList.push(item)
    }
    console.log(this.downloadList)
    this.submitted = false;
    this.modalService.open(modal, { size: 'md' });
    this.projectId = id;
  }
  addRow() {

    this.form.push(this.formGroup());
  }
  reportPage(id){
      this.router.navigate(['/app/project/manage/project/report/' + id]);
  }
  // recordPage(){
  //   this.router.navigate(['app/main/pages/project/record']);
  // }
  rowSubmit(modal) {
    for (let i = 0; i < this.form.value.length; i++) {
      this.form.controls[i].patchValue({
        projectId: this.projectId
      })
    }
    if (this.modalForm.valid) {
      for (let i = 0; i < this.form.value.length; i++) {
        this.downloadList.workOrderFileUploadDTOList.push(this.form.value[i]);
      }
    }
 
    this.spinner.show();
    this.ManageProjectService.upload(this.downloadList).pipe(first()).subscribe(res => {
      this.getProject();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });


  }
  statusModal(modal, Id){
    this.modalService.open(modal, { size: 'md' });
    this.Id = Id;
  }
  statusCompleted(modal){
    
      this.spinner.show();
      this.ManageProjectService.getStatus(this.Id).pipe(first()).subscribe(res => {
      
        this.getProject();
        modal.dismiss("Cross Click");
        this.spinner.hide();
        this.Toastr.success(res.message);
      }, err => {
        modal.dismiss("Cross Click");
        this.spinner.hide();
        //this.Toastr.error(err.error.error.reason);
        // this.Toastr.error(err.error.error.reason);
      });
    
  }
  deleteFile(index) {
    this.downloadList.workOrderFileUploadDTOList.splice(index, 1);
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
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (() => {
      this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
      console.log(this.modalForm.value)
    });

  }

  getProject() {
    $('#manage-table').DataTable().clear().destroy();
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#manage-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.projectArr = res.data;
      this.totalCost = 0;
      this.totalGst = 0;
      for (let i = 0; i < res.data.length; i++) {
        this.totalCost += res.data[i].projectedCost;
        this.totalGst += res.data[i].projectGst;
      }
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  editProject(id) {
    this.spinner.show();
    this.router.navigate(['app/project/manage/project/' + id]);
  }
  deleteModal(content, projectId) {
    this.modalService.open(content, { size: 'md' });
    this.projectId = projectId
  }
  deleteProject(modal) {
    this.spinner.show();
    this.ManageProjectService.delectProject(this.projectId).pipe(first()).subscribe(res => {
      this.getProject();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
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
    var win = window.open(environment.apiUrl + 'api/project/download/' + download.projectId + '/' + download.id);
    win.focus();
    modal.dismiss("Cross Click");
    this.spinner.hide();
  }
}
