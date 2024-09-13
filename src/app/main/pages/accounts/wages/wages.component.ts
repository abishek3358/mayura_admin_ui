import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeAttendanceService } from './../../project/employee-attendance/employee-attendance.service';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { WagesService } from './wages.service';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

@Component({
  selector: 'app-wages',
  templateUrl: './wages.component.html',
  styleUrls: ['./wages.component.scss']
})
export class WagesComponent implements OnInit {
  wagesForm: FormGroup;
  modalForm:FormGroup;
  submitted = false;
  

  formSubmitted = false;
  WaitingFortheResponse = false;
  update = false;
  wagesArray: any = [];
  projectArr: any = [];
  payroll: any = {};
  dateArr: any = [];
  dataObj: any = {};
  demo: any = {}
  wagesId = "";
  wagesUploadId: "";
  downloadList: any = [];
  constructor(
    private EmployeeAttendanceService: EmployeeAttendanceService,
    private ManageProjectService: ManageProjectService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private WagesService: WagesService,
    private modalService: NgbModal,
    private fb: FormBuilder

  ) {

  }

  ngOnInit(): void {
    // this.modalForm = this.fb.group({
    //   wagesArr: this.fb.array([this.formGroup()]),
    // })
    this.spinner.show();
    this.getWagesList();
  }
 
  recordPayment(id){
    this.spinner.show();
    this.router.navigate(['/app/accounts/wages/record/payment/' + id])
  }
 
  // onFileChange(event,index){
  //   console.log(event)
  //     const wagesArr = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(wagesArr);
  //     reader.onload = (() => {
  //       this.form.at(index).patchValue({ fileName: event.target.files[0].name, fileBase64: reader.result });
  //       console.log(this.modalForm.value)
  //     });
      
  //   }
  addWages() {
    this.router.navigate(['app/accounts/wages/new'])
  }
  editPayroll(id) {
    this.router.navigate(['/app/accounts/wages/new/', id])
  }
  viewPayroll(projectId , month){
    this.router.navigate(['/app/accounts/wages/view' + '/' + projectId + '/' + month])
    
  }
  // download(projectId,month){
  //    var win = window.open(environment.apiUrl + 'api/payroll/download/payroll/' + projectId +'/' + month)
  //    win.focus();
  // }
  getWagesList() {
    $('#wages').DataTable().clear().destroy();
    this.WagesService.getPayroll().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#wages').DataTable({
          "iDisplayLength": 100
        });
      });
      this.wagesArray = res.data;
      console.log(this.wagesArray)
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
deleteCofirmation(modal,list){
  this.modalService.open(modal,{size:''});
  this.wagesId = list.id;
}
delete(modal){
  this.spinner.show();
  this.WagesService.deletePayroll(this.wagesId).pipe(first()).subscribe(res=>{
    this.getWagesList();
    this.Toastr.success(res.message);
    modal.dismiss("cross click");
  },err=>{
    modal.dismiss("cross click");
    this.spinner.hide();
    this.Toastr.error(err.error.error.reason);
  });
}

}
