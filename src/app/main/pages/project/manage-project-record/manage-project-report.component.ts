import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArrayName } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { ManageProjectService } from '../manage-project-form/manage-project.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-project-report',
  templateUrl: './manage-project-report.component.html',
  styleUrls: ['./manage-project-report.component.scss']
})
export class ManageProjectReportComponent implements OnInit {
  reportForm: FormGroup;
  submitted = false;
  record: any = {}
  waitingForTheResponse = false;
  projectPurchaseAndWagesDTOList: any = [];
  miExpenseDTODTOList: any = [];
  projectSubListDTOList: any = [];
  projectArr: any = [];
  constructor(private fb: FormBuilder,
    private manageProject: ManageProjectService,
    // private spinner: NgxSpinner,
     private Toastr: ToastrService,
     private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      projectId: [null, [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    })
    this.getProject();
    if(this.route.snapshot.params['id']){
      this.reportForm.patchValue({
        projectId:this.route.snapshot.params["id"]
      })
    }
  }
  get f() { return this.reportForm.controls; }
  submit() {
    this.submitted = true;
    if (this.reportForm.invalid) {
      return;
    }
    
    this.reportForm.value.fromDate = this.reportForm.value.fromDate.day + '/' + this.reportForm.value.fromDate.month + '/' + this.reportForm.value.fromDate.year;
    this.reportForm.value.toDate = this.reportForm.value.toDate.day + '/' + this.reportForm.value.toDate.month + '/' + this.reportForm.value.toDate.year;

    this.waitingForTheResponse = true;
    this.manageProject.projectReport(this.reportForm.value).pipe(first()).subscribe(res => {
      // console.clear();
      console.log(res);
      this.record = res.data;

      // if (this.reportForm.value.projectId) {

      
      //   this.record = res.data;
      // } else {
      //   this.record = res.data;

      //   this.waitingForTheResponse = false;
      //   this.record.overAllPercentageOfTotalIncome = (this.record.overAllPercentageOfTotalIncome).toFixed(2);
      // }

      this.record.percentageOfTotalIncome = (this.record.percentageOfTotalIncome).toFixed(2);
      this.record.netProfit = (this.record.netProfit).toFixed(2)



      //     this.Toastr.success(res.message);
      //   }, err => {

      //     this.Toastr.error(err.error.error.reason);
      //   });

      // }
    });

}
getProject() {
  this.manageProject.getProject().pipe(first()).subscribe(res => {
    this.projectArr = res.data;
    // this.
    
  }, err=>{
    this.Toastr.error(err.error.error.reason);
  });

}
}