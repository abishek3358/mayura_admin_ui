import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeAttendanceService } from '../../../project/employee-attendance/employee-attendance.service';
import { ManageProjectService } from '../../../project/manage-project-form/manage-project.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { WagesService } from '../wages.service';

@Component({
  selector: 'app-wages-form',
  templateUrl: './wages-form.component.html',
  styleUrls: ['./wages-form.component.scss']
})
export class WagesFormComponent implements OnInit {
  wagesForm: FormGroup;

  formSubmitted = false;
  WaitingFortheResponse = false;
  update = false;
  projectArr: any = [];
  payroll: any = {};
  dateArr: any = [];
  dataObj: any = {};
  demo: any;
  waitingForTheResponse: boolean = false;
  constructor(
    private EmployeeAttendanceService: EmployeeAttendanceService,
    private ManageProjectService: ManageProjectService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private WagesService: WagesService,

  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.wagesForm = this.formBuilder.group({
      id: [null],
      projectId: [null, [Validators.required]],
      date: [null],
      month: [null],
      employees: this.formBuilder.array([this.wagesMainGroup()]),
      totalWages:[0,[Validators.required]]
    });
    if (this.route.snapshot.params['id']) {
      this.getPayroll(this.route.snapshot.params['id']);
      this.update = true
    }
    this.getProject();
  }
  wagesMainGroup() {
    return this.formBuilder.group({
      id: [null],
      designation: [null],
      employeeId: [null],
      payrollId: [null],
      noOfDaysWorked: [null],
      dateOfPayment: [null],
      paymentStatus: [null],
      categoryType: [null],
      employeeName: [null],
      fatherName: [null],
      slNoFrom: [null],
      basicWages: [0],
      dailyWages: [0],
      totalWages: [0],
      netAmount: [0],
      dearnessAllowanceAmount: [0],
      otherAllowanceAmount: [0],
      overtimeAllowanceAmount: [0],
      pfAmount: [0],
      esiAmount: [0],
      leaveBalance: [0],
      leaveEncashAmount: [0],
    })
  }
  get f() {
    return this.wagesForm.controls
  }
  get wagesMainList(): FormArray {
    return this.wagesForm.get("employees") as FormArray
  }

  getDate() {
    this.EmployeeAttendanceService.getDetails(this.wagesForm.value.month).pipe(first()).subscribe(res => {
      this.dateArr = res.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
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
  calculateTotalWages() {
    let amount = 0;
    for (let i = 0; i < this.wagesMainList.controls.length; i++) {
      amount += parseFloat(this.wagesMainList.value[i].netAmount);
      if (i == this.wagesMainList.controls.length - 1) {
        this.wagesForm.patchValue({
          totalWages:amount.toFixed(2)
        })
      }
    }

  }
  onFetch() {
    // this.wagesForm.value.month = this.wagesForm.value.month + "-" + this.dateArr[0];
    this.wagesForm.value.date = this.dateArr[0];

    if ((this.wagesForm.value.projectId == null || this.wagesForm.value.projectId == '') || (this.wagesForm.value.month == null || this.wagesForm.value.month == '')) {
      this.Toastr.error("Please fill all mandatory fields.", 'Warning');
      this.formSubmitted = true;
      return;
    }
    this.spinner.show();
    this.WagesService.searchPayroll(this.wagesForm.value).pipe(first()).subscribe(res => {
      console.log(res)
      this.waitingForTheResponse = true;
      this.demo = res.data[0].employees;
      this.wagesMainList.controls = [];
      for (let i = 0; i < this.demo.length; i++) {
        this.wagesMainList.push(this.wagesMainGroup());
        this.wagesMainList.controls[i].patchValue({
          basicWages: this.demo[i].basicWages,
          dailyWages: this.demo[i].dailyWages,
          slNoFrom: this.demo[i].slNoFrom,
          employeeId: this.demo[i].employeeId,
          employeeName: this.demo[i].employeeName,
          fatherName: this.demo[i].fatherName,
          categoryType: this.demo[i].categoryType,
          noOfDaysWorked: this.demo[i].noOfDaysWorked,
          designation: this.demo[i].designation,
          id: this.demo[i].id,
          payrollId: this.demo[i].payrollId,
          dateOfPayment: this.demo[i].dateOfPayment,
          paymentStatus: this.demo[i].paymentStatus,
        })
      }

      this.WaitingFortheResponse = true;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });

  }
  onSubmit() {
    this.spinner.show();
    this.formSubmitted = true;
    this.wagesForm.value.month = this.wagesForm.value.month + "-" + this.dateArr[0];
    this.wagesForm.value.date = this.dateArr[0];
    if (this.wagesForm.invalid) {
      return;
    }
    if (!this.wagesForm.value.id) {
      this.WagesService.createPayroll(this.wagesForm.value).pipe(first()).subscribe(res => {
        console.log(res)
        this.spinner.hide();
        this.Toastr.success(res.data);
        this.router.navigate(['app/accounts/wages']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.WagesService.updatePayroll(this.wagesForm.value).pipe(first()).subscribe(res => {
        console.log(res)
        this.spinner.hide();
        this.Toastr.success(res.data);
        this.router.navigate(['app/accounts/wages']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  calculateTotal(i) {
    let total = 0;
    total = this.demo[i].basicWages + parseFloat(this.wagesMainList.value[i].dearnessAllowanceAmount) +
      parseFloat(this.wagesMainList.value[i].otherAllowanceAmount) +
      parseFloat(this.wagesMainList.value[i].overtimeAllowanceAmount) +
      parseFloat(this.wagesMainList.value[i].leaveEncashAmount);
    this.wagesMainList.controls[i].patchValue({
      totalWages: total.toFixed(2)
    });
    if (this.demo[i].basicWages > 15000) {
      let total = 0;
      total = 1800;
      this.wagesMainList.controls[i].patchValue({
        pfAmount: total.toFixed(2)
      });
    }
    else {
      let total = 0;
      let per = 0.12;
      total = parseFloat(this.wagesMainList.value[i].totalWages) * per;
      this.wagesMainList.controls[i].patchValue({
        pfAmount: total.toFixed(2)
      });
    }

    let netAmount = 0;
    netAmount = parseFloat(this.wagesMainList.value[i].totalWages) -
      parseFloat(this.wagesMainList.value[i].pfAmount) - parseFloat(this.wagesMainList.value[i].esiAmount);
    this.wagesMainList.controls[i].patchValue({
      netAmount: netAmount.toFixed(2)
    });

  }
  getPayroll(id) {
    this.spinner.show();
    this.WagesService.singlePayrollGet(id).pipe(first()).subscribe(res => {
      console.log(res)
      this.waitingForTheResponse = true;
      this.dateArr[0] = res.data.date
      this.demo = res.data.employees;
      this.wagesMainList.controls = [];
      for (let i = 0; i < this.demo.length; i++) {
        this.wagesMainList.push(this.wagesMainGroup());
        this.wagesMainList.controls[i].patchValue({
          basicWages: this.demo[i].basicWages,
          dailyWages: this.demo[i].dailyWages,
          slNoFrom: this.demo[i].slNoFrom,
          employeeId: this.demo[i].employeeId,
          employeeName: this.demo[i].employeeName,
          fatherName: this.demo[i].fatherName,
          categoryType: this.demo[i].categoryType,
          noOfDaysWorked: this.demo[i].noOfDaysWorked,
          designation: this.demo[i].designation,
          id: this.demo[i].id,
          payrollId: this.demo[i].payrollId,
          dateOfPayment: this.demo[i].dateOfPayment,
          paymentStatus: this.demo[i].paymentStatus,
          dearnessAllowanceAmount: this.demo[i].dearnessAllowanceAmount,
          esiAmount: this.demo[i].esiAmount,
          leaveBalance: this.demo[i].leaveBalance,
          leaveEncashAmount: this.demo[i].leaveEncashAmount,
          netAmount: this.demo[i].netAmount,
          otherAllowanceAmount: this.demo[i].otherAllowanceAmount,
          overtimeAllowanceAmount: this.demo[i].overtimeAllowanceAmount,
          pfAmount: this.demo[i].pfAmount,
          totalWages: this.demo[i].totalWages,
        })
      }
      this.wagesForm.patchValue({
        date: res.data.date,
        id: res.data.id,
        month: res.data.month,
        projectId: res.data.projectId,
        employees: res.data.employees,
      })
      this.calculateTotalWages();
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
