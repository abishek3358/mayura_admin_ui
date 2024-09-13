import { Component, OnInit } from '@angular/core';
import { FormGroup, Validator, FormBuilder, Validators } from '@angular/forms';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { first } from 'rxjs/operators';
import { EmployeeAttendanceService } from '../employee-attendance/employee-attendance.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-employee-attendance-view',
  templateUrl: './employee-attendance-view.component.html',
  styleUrls: ['./employee-attendance-view.component.scss']
})
export class EmployeeAttendanceViewComponent implements OnInit {
  attendanceViewForm: FormGroup;
  attendanceViewSubmitted = false;
  WaitingFortheResponse = false;
  projectArr: any = [];
  reportArr: any = [];
  // todoitems: any={};
  // viewDetails: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private ManageProjectService: ManageProjectService,
    private EmployeeAttendanceService: EmployeeAttendanceService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.attendanceViewForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      month: [null],
      type: [null]
    });
    this.getProject();
    // console.log(this);
    // this.todoitems = JSON.parse(localStorage.getItem('viewValue'));
    // this.attendanceViewForm.patchValue({
    //   projectId: this.todoitems.projectId,
    //   month: this.todoitems.month,  
    // });   
    // console.log(localStorage.getItem('viewValue'));
    // this.getReport();
  }

  // ngOnDestroy(){
  //   localStorage.removeItem('this.viewValue');
  // }

  get f() {
    return this.attendanceViewForm.controls;
  }
  // demo(){
  //   console.log("hi")
  //  console.log($('#month').disabled);
  // }
  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message)
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  addAttendance() {
    // alert('hi')
    this.attendanceViewForm.patchValue({
      type: 'create'
    })
    localStorage.setItem('attendance', JSON.stringify(this.attendanceViewForm.value));
    this.router.navigate(['app/project/emp/attendance/view'])
  }
  editAttendance(id) {
this.router.navigate(['app/project/emp/attendance/view/', id])
  }
  getReport() {
    this.attendanceViewSubmitted = true;

    if (this.attendanceViewForm.invalid) {
      return
    }
    this.spinner.show();
    $('#attendanceTable').DataTable().clear().destroy();

    this.EmployeeAttendanceService.searchDetails(this.attendanceViewForm.value).pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#attendanceTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.reportArr = res.data;
      this.WaitingFortheResponse = true;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
}
function projectId(projectId: any, month: any) {
  throw new Error('Function not implemented.');
}

function month(projectId: any, month: any) {
  throw new Error('Function not implemented.');
}

