import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Stepper from 'bs-stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageProjectService } from '../../../pages/project/manage-project-form/manage-project.service';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { CategoryService } from './../../masters/category/category.service';

declare let $: any;
import { MisExpenseService } from './mis-expense.service';
@Component({
  selector: 'app-mis-expense',
  templateUrl: './mis-expense.component.html',
  styleUrls: ['./mis-expense.component.scss']
})
export class MisExpenseComponent implements OnInit {
  private stepper: Stepper;
  misExpenseForm: FormGroup;
  misExpenseSubmitted = false;
  WaitingFortheResponse: Boolean = false;
  misExpenseObj: any = {};
  misExpenseArr: any = [];
  id: any;
  categoryArr: any = [];
  accountGroupArr: any = [];
  jobCodeArr: any = [];
  projectId: any;
  categoryId: any;
  misExpenseId = "";

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private AccountGroupService: AccountGroupService,
    private ManageProjectService: ManageProjectService,
    private CategoryService: CategoryService,
    private MisExpenseService: MisExpenseService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.misExpenseForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      id: [null],
      categoryId: [null, [Validators.required]],
    });
    this.getProject();
    this.getcategory();
    // this.onSubmit();
    this.WaitingFortheResponse = true;
    this.getMisExpenseTableList();
  }
  get f() {
    return this.misExpenseForm.controls
  }
  getMisExpenseTableList() {
    $('#misExpenseTable').DataTable().clear().destroy();
    this.MisExpenseService.getMisExpense().pipe(first()).subscribe(res => {
      this.misExpenseArr = res.data;
      this.Toastr.success(res.message);
      $(document).ready(function () {
        $('#misExpenseTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
    })
  }
  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.jobCodeArr = res.data;
      let length = this.jobCodeArr.unshift("all");
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }
  jobCode(event) {
    this.projectId = event.id
  }
  category(event) {
    this.WaitingFortheResponse = true;
    this.categoryId = event.id
  }
  onSubmit() {
    if ((this.misExpenseForm.value.projectId == null || this.misExpenseForm.value.projectId == '') || (this.misExpenseForm.value.categoryId == null || this.misExpenseForm.value.categoryId == '')) {
      this.Toastr.error("Please fill all mandatory fields.", 'Warning');
      this.misExpenseSubmitted = true;
      return;
    }
    if (this.misExpenseForm.value.projectId == 'all' && this.misExpenseForm.value.categoryId == 'all') {
      this.misExpenseSubmitted = false;
      this.MisExpenseService.getMisExpense().pipe(first()).subscribe(res => {
        this.misExpenseArr = res.data;
      })
      // this.misExpenseForm.reset({});
    } else if ((this.misExpenseForm.value.projectId && this.misExpenseForm.value.categoryId == 'all') ||
      (this.misExpenseForm.value.projectId == 'all' && this.misExpenseForm.value.categoryId)) {
      this.misExpenseArr = [];
    }
    else {
      // this.misExpenseForm.reset({});
      this.MisExpenseService.getDoubleMisExpense(this.projectId, this.categoryId).pipe(first()).subscribe((res: any) => {
        this.misExpenseArr = res.data;
        this.WaitingFortheResponse = true;
        this.spinner.hide();
        this.Toastr.success(res.message);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      })
    }
  }
  // cancel(){
  //   this.misExpenseSubmitted = false;
  //   this.MisExpenseService.getMisExpense().pipe(first()).subscribe(res => {
  //     this.misExpenseArr = res.data;
  //   })
  //   this.misExpenseForm.reset({});
  // }

  getcategory() {
    this.CategoryService.getCategory().pipe(first()).subscribe(res => {
      this.categoryArr = res.data;
      let length = this.categoryArr.unshift("all");
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }
  editmisExpense(id) {
    this.spinner.show();
    this.route.navigate(['app/accounts/mis/expense' + '/' + id]);
  }
  deleteConfirmation(modal,misExpense){
    this.modalService.open(modal,{size:'md'});
    this.misExpenseId = misExpense.id;
  }
  deletemisExpense(modal) {
    this.spinner.show();
    this.MisExpenseService.deleteData(this.misExpenseId).pipe(first()).subscribe((res: any) => {
      this.Toastr.success(res.data);
      modal.dismiss("cross click");
      this.getMisExpenseTableList();
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

}
