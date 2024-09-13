import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { WagesService } from '../wages/wages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';
import { Console, error } from 'console';
import { ToastrService } from 'ngx-toastr';
// declare let $:any;

@Component({
  selector: 'app-wages-view',
  templateUrl: './wages-view.component.html',
  styleUrls: ['./wages-view.component.scss']
})
export class WagesViewComponent implements OnInit {

  projectId: any;
  month: any;
  payrollEmployeeDTO: any = {};



  constructor(private payroll: WagesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.projectId = this.route.snapshot.params['id'];
    this.month = this.route.snapshot.params['month'];
    this.spinner.show();
    if (this.projectId, this.month) {
      this.viewPayrollsearch(this.projectId, this.month);
    }

    console.log(this.payrollEmployeeDTO)
  }
  viewPayrollsearch(projectId, month) {
    // $('#wagesView').DataTable().clear().destroy();
    this.payroll.viewPayroll(projectId, month).pipe(first()).subscribe(res => {
      // $(document).ready(function () {
      //   $('#wagesView').DataTable({
      //     "iDisplayLength": 100
      //   });
      // });
      console.log(res)
      this.payrollEmployeeDTO = res.data;
      this.Toastr.success(res.message);
      this.spinner.hide();

    }), err =>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    

    }
    
  }
  download(projectId, month) {
    console.log(projectId)
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/payroll/download/payroll/' + projectId + '/' + month);
    win.focus();
    this.spinner.hide();
  }
}
