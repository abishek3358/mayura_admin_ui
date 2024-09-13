import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfitAndLossService } from './profit-and-loss.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.scss']
})
export class ProfitAndLossComponent implements OnInit {
  Submitted = false;
  profitAndLossForm: FormGroup;
  projectArr: any = [];
  waitingForTheResponse: boolean = false;
  profitAndLossObj: any = {};
  profitAndLossResponseDTOList: any = [];
  profitAndLossArr: any = [];
  waitingForTheResponseDate: boolean = false;
  waitingForfullstatementTheResponse: boolean = false;
  constructor(
    private fb: FormBuilder,
    private project: ManageProjectService,
    private spinner: NgxSpinnerService,
    private ProfitAndLossService: ProfitAndLossService,
    private Toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.profitAndLossForm = this.fb.group({
      projectId: [],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    })
    this.getProject();
    // console.clear();

  }

  get f() { return this.profitAndLossForm.controls; }
  Submit() {
    this.Submitted = true;
    if (this.profitAndLossForm.invalid) {
      console.log(this.profitAndLossForm);
      return
    }

    this.profitAndLossForm.value.fromDate = this.profitAndLossForm.value.fromDate.day + '/' + this.profitAndLossForm.value.fromDate.month + '/' + this.profitAndLossForm.value.fromDate.year;
    this.profitAndLossForm.value.toDate = this.profitAndLossForm.value.toDate.day + '/' + this.profitAndLossForm.value.toDate.month + '/' + this.profitAndLossForm.value.toDate.year;
this.spinner.show();

    this.ProfitAndLossService.profitAndLoss(this.profitAndLossForm.value).pipe(first()).subscribe(res => {
      // console.clear();
      console.log(res);

      if (this.profitAndLossForm.value.projectId) {
        this.waitingForfullstatementTheResponse = false;
        this.waitingForTheResponse = true;
        this.profitAndLossObj = res.data;
      } else {
        this.profitAndLossObj = res.data;
        this.waitingForfullstatementTheResponse = true;
        this.waitingForTheResponse = false;
        this.profitAndLossObj.overAllPercentageOfTotalIncome = (this.profitAndLossObj.overAllPercentageOfTotalIncome).toFixed(2);
      }

      //  this.profitAndLossObj.percentageOfTotalIncome = (this.profitAndLossObj.percentageOfTotalIncome).toFixed(2);
      //this.profitAndLossObj.netProfit = (this.profitAndLossObj.netProfit).toFixed(2)
 

      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });

  }
  getProject() {
    this.project.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

}
