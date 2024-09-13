import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageProjectService } from './../../../../pages/project/manage-project-form/manage-project.service';
import { AccountGroupService } from './../../../accounts/account-group/account-group.service';
import { CategoryService } from './../../../masters/category/category.service';
import { MisExpenseService } from '../mis-expense.service';

declare let $: any;

@Component({
  selector: 'app-mis-expense-form',
  templateUrl: './mis-expense-form.component.html',
  styleUrls: ['./mis-expense-form.component.scss']
})
export class MisExpenseFormComponent implements OnInit {
  misExpenseForm: FormGroup;
  misExpenseSubmitted = false;
  misExpenseObj: any = {};
  misExpenseArr: any = [];
  categoryArr: any = [];
  accountGroupArr: any = [];
  jobCodeArr: any = [];
  id: any;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private ManageProjectService: ManageProjectService,
    private AccountGroupService: AccountGroupService,
    private CategoryService: CategoryService,
    private MisExpenseService: MisExpenseService
  ) { }

  ngOnInit(): void {
    this.misExpenseForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      accountGroupId: [null, [Validators.required]],
      id: [null],
      categoryId: [null, [Validators.required]],
      referenceNo: [null, [Validators.required]],
      expenseName: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      notes: [null, [Validators.required]],

    });
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singleMisExpense(id);
    }
    this.getProject();
    this.getAccountGroupList();
    this.getcategory();
    // this.onSubmit()

  }
  get f() {
    return this.misExpenseForm.controls
  }

  onSubmit() {
    this.misExpenseSubmitted = true;
    if (this.misExpenseForm.invalid) {
      return;
    }
    this.spinner.show();
    this.misExpenseForm.value.date = this.misExpenseForm.value.date.day + '/' + this.misExpenseForm.
      value.date.month + '/' + this.misExpenseForm.value.date.year;

    if (this.misExpenseForm.value.id) {
      this.MisExpenseService.updateMisExpense(this.misExpenseForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/accounts/mis/expense']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.MisExpenseService.createMisExpense(this.misExpenseForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/accounts/mis/expense']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.jobCodeArr = res.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }

  getAccountGroupList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupArr = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }
  getcategory() {
    this.CategoryService.getCategory().pipe(first()).subscribe(res => {
      this.categoryArr = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }
  singleMisExpense(id) {
    this.MisExpenseService.getSingleMisExpense(id).pipe(first()).subscribe(res => {
      if (res.data.date) {
        var toDate = res.data.date.split('/');
        let date = new Date(toDate[1] + '-' + toDate[0] + ' ' + toDate[2]);
        res.data.date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
      }
      this.misExpenseForm.patchValue({
        projectId: res.data.projectId,
        accountGroupId: res.data.accountGroupId,
        id: res.data.id,
        notes: res.data.notes,
        amount: res.data.amount,
        date: res.data.date,
        categoryId: res.data.categoryId,
        referenceNo: res.data.referenceNo,
        expenseName: res.data.expenseName,
      })
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

}
