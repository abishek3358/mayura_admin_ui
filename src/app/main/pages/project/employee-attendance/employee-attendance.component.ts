import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmployeeAttendanceService } from './employee-attendance.service';
import { EmployeeService } from '../employee/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit, OnDestroy {
  employeeAttendanceForm: FormGroup;
  empAttendanceSubmitted = false;
  projectArr: any = [];
  // attendanceDetails: any = {};
  WaitingFortheResponse = false;
  id: any;
  dateArr = [];
  dataObj: any = {};
  update = false;
  constructor(
    private formBuilder: FormBuilder,
    private ManageProjectService: ManageProjectService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private EmployeeAttendanceService: EmployeeAttendanceService,
    private EmployeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.spinner.show();
    this.employeeAttendanceForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      id: [null],
      month: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      employeeAttendanceDtlDTOList: this.formBuilder.array([this.employeeAttendanceFormGroup()])
    });
    if (this.route.snapshot.params['id']) {
      this.getAttendanceDetails(this.route.snapshot.params['id']);
      this.update = true
    }
    this.getProject();
    if (JSON.parse(localStorage.getItem('attendance')) != null) {
      if (JSON.parse(localStorage.getItem('attendance')).type == 'create') {
        this.dataObj = JSON.parse(localStorage.getItem('attendance'));
        this.employeeAttendanceForm.patchValue({
          projectId: this.dataObj.projectId
        })
        if (this.dataObj.type == 'create') {
          this.getAttendance(this.dataObj.projectId);
        }
      }

    }
  }
  ngOnDestroy() {
    localStorage.removeItem('attendance');
  }
  employeeAttendanceFormGroup() {
    return this.formBuilder.group({
      attendance: [null, [Validators.required]],
      employeeAttendanceId: [null],
      employeeId: [null],
      employeeName: [null, [Validators.required]],
      id: [null],
      slNoForm: [null, [Validators.required]],
    })
  }
  get f() {
    return this.employeeAttendanceForm.controls
  }
  get employeeAttendanceDtlDTOListArr() {
    return this.employeeAttendanceForm.get('employeeAttendanceDtlDTOList') as FormArray
  }
  getDate(id) {
    this.EmployeeAttendanceService.getDetails(id).pipe(first()).subscribe(res => {
      this.dateArr = res.data;
    })
  }
  monthShow() {
    // document.getElementById('month').ontoggle()
  }
  getAttendanceDetails(id) {
    this.EmployeeAttendanceService.singleAttendanceGet(id).pipe(first()).subscribe(res => {
      this.dateArr[0]=res.data.date
      this.employeeAttendanceDtlDTOListArr.controls = [];
      for (let i = 0; i < res.data.employeeAttendanceDtlDTOList.length; i++) {
        this.employeeAttendanceDtlDTOListArr.push(this.employeeAttendanceFormGroup());
      }
      this.employeeAttendanceForm.patchValue({
        date:  res.data.date,
        id:  res.data.id,
        month:  res.data.month,
        projectId:  res.data.projectId,
        employeeAttendanceDtlDTOList: res.data.employeeAttendanceDtlDTOList,
      })
    })
  }
  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getAttendance(id) {
    this.spinner.show();
    this.EmployeeService.attendanceDetails(id).pipe(first()).subscribe(res => {
      // this.attendanceDetails = res.data;
      console.log(res.data)
      this.WaitingFortheResponse = true;
      const MappingList = this.employeeAttendanceForm.get('employeeAttendanceDtlDTOList') as FormArray;
      MappingList.controls = [];
      for (let i = 0; i < res.data.length; i++) {
        this.employeeAttendanceDtlDTOListArr.push(this.employeeAttendanceFormGroup());
        this.employeeAttendanceDtlDTOListArr.controls[i].patchValue({
          slNoForm: res.data[i].employeeCode,
          employeeName: res.data[i].name,
          employeeId: res.data[i].id
        });
      }

      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  onSubmit() {
    this.empAttendanceSubmitted = true;
    if (this.employeeAttendanceForm.invalid) {
      return;
    }
    this.spinner.show();
    if(!this.employeeAttendanceForm.value.id) {
    this.EmployeeAttendanceService.createAttendance(this.employeeAttendanceForm.value).pipe(first()).subscribe(res => {
      this.spinner.hide();
      this.Toastr.success(res.data);
      this.router.navigate(['app/project/emp/attendance']);
      // this.empAttendanceSubmitted = false;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }else {
    this.EmployeeAttendanceService.updateAttendance(this.employeeAttendanceForm.value).pipe(first()).subscribe(res => {
      this.spinner.hide();
      this.Toastr.success(res.data);
      this.router.navigate(['app/project/emp/attendance']);
      // this.empAttendanceSubmitted = false;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  }

}
