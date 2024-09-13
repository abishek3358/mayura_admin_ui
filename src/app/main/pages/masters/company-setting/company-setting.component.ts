import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanySettingService } from './company-setting.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { CompanyContactsService } from './../../masters/company-contacts/company-contacts.service';

declare let $: any;

@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.scss']
})
export class CompanySettingComponent implements OnInit {
  companySubmitted = false;
  companyForm: any;
  buttonText: string = "";
  companyObj: any = {};
  companyArr: any = [];
  compArr: any = [];
  compArrList: any = [];
  cmpcontactArr: any = [];
  constructor(
    private formBuilder: FormBuilder, private modalService: NgbModal,
    private CompanySettingService: CompanySettingService,
    private CompanyContactsService: CompanyContactsService,
    private toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.get();
  }
  put() {
    this.CompanySettingService.updatecompany(this.companyForm.value).pipe(first()).subscribe(res => {
      this.compArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    })
  }
  get() {
    this.CompanySettingService.getcompany().pipe(first()).subscribe(res => {
      this.companyObj = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    })
  }
  editCompany(id) {
    this.spinner.show();
    this.route.navigate(['app/master/company/setting/new']);
  }
  editCompanyContacts(id){}
  getCmpcontacts() {
    $('#cmpcontact').DataTable().clear().destroy();
    this.CompanyContactsService.getCmpcontacts().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#cmpcontact').DataTable({
          "iDisplayLength": 100
        });
      });
      this.cmpcontactArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
}
