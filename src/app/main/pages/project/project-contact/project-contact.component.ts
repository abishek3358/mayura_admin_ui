import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectContactService } from './project-contact.service';
import { ManageProjectService } from '../manage-project-form/manage-project.service';
import { EmployeeService } from './../employee/employee.service';

declare let $: any;

@Component({
  selector: 'app-project-contact',
  templateUrl: './project-contact.component.html',
  styleUrls: ['./project-contact.component.scss']
})
export class ProjectContactComponent implements OnInit {

  ProjectSubmitted = false;
  projectForm: FormGroup;
  buttonText: string = "";
  projectArr: any = [];
  projectcontactArr: any = [];
  empArr: any = [];



  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Toastr: ToastrService,
    private projectContacts: ProjectContactService,
    private ManageProjectService: ManageProjectService,
    private EmployeeService: EmployeeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.projectForm = this.formBuilder.group({
      employeeId: [null, Validators.required],
      employeeType: [null,[Validators.required]],
      projectId: [null, Validators.required],
      id: [null]
    });
    this.getAllproject();
    this.getProject();
    this.getEmployee();
  }
  get f() { return this.projectForm.controls };

  /*List of Project*/
  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  /*List of Employ*/

  getEmployee() {
    this.EmployeeService.getEmp().pipe(first()).subscribe(res => {
      this.empArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  openModal(content: any) {
    this.buttonText = "Submit";
    this.projectForm.reset({});
    this.ProjectSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }
  /*List of Project-Contacts*/

  getAllproject() {
    $('#project-table').DataTable().clear().destroy();
    this.projectContacts.getProject().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#project-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.projectcontactArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  /*Edit Function*/
  editproject(content, project) {
    this.projectForm.reset({});
    this.ProjectSubmitted = false;
    this.buttonText = "Update";
    this.projectForm.patchValue({
      employeeId: project.employeeId,
      employeeType: project.employeeType,
      projectId: project.projectId,
      id: project.projectContactsId
    })
    this.modalService.open(content, { size: 'sm' });
  }
  /*Delete Function*/

  delete(project) {
  
    this.spinner.show();
    this.projectContacts.deleteProject(project.projectContactsId).pipe(first()).subscribe(res => {
      this.Toastr.success(res.data);
      this.getAllproject();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  /*Create & Update Function*/

  submit(modal) {
    this.ProjectSubmitted = true;
    if (this.projectForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.projectForm.value.id) {
      this.projectContacts.updateProject(this.projectForm.value).pipe(first()).subscribe(res => {
        this.getAllproject();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.projectContacts.createProject(this.projectForm.value).pipe(first()).subscribe(res => {
        modal.dismiss("cross click");
        this.Toastr.success(res.data);
        this.getAllproject();
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
}
