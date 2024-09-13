import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { first } from 'rxjs/operators';
import { EmployeeService } from '../employee.service';
import { LocationService } from './../../../masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageProjectService } from '../../../../pages/project/manage-project-form/manage-project.service';
import {CategoryService} from '../../../masters/category/category.service'
declare let $: any;
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  private stepper: Stepper;
  empForm: FormGroup;
  empSubmitted = false;
  buttonText: string = "";
  countryArr: any = [];
  stateArr: any = [];
  cityArr: any = [];
  cityObj: any = {};
  stateListObj: any = {};
  cityListObj: any = {};
  configData;
  projectArr: any =[];
  toastr: any;
  activedId: number;
  empObj: any;
  id: any[];
  categoryArr:any=[];
  constructor(
    private formBuilder: FormBuilder,
    private EmployeeService: EmployeeService,
    private LocationService: LocationService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner:NgxSpinnerService,
    private ManageProjectService:ManageProjectService,
    private CategoryService:CategoryService
    ) { }


    ngOnInit():void {
      this.stepper = new Stepper(document.querySelector('#stepper1'), {});
      this.empForm = this.formBuilder.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required]],
        employeeCode: [null, [Validators.required]],
        addressLine1: [null],
        addressLine2: [null,],
        fathersName: [null,[Validators.required]],
        countryId: [null],
        cityId: [null],
        stateId: [null],
        id: [null],
        postalCode: [null],
        contactNo:[null, Validators.required],
        wages: [null, Validators.required],
        wagesType: [null, Validators.required],
        projectId: [null, Validators.required],
        designation:[null,Validators.required],
        category:[null,[Validators.required]],
        joiningDate:[null,[Validators.required]],
        resigningDate:[null],
    
      });
      let id = this.router.snapshot.params['id'];
      if (id) {
        this.singleEmp(id);
      }
      this.getCountry();
      this.getProject();
      this.getCategory();
    }

  getState(id) {
    this.spinner.show();
    this.LocationService.singleState(id).pipe(first()).subscribe(res => {
      this.stateArr = res.data.stateList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCategory(){
    this.CategoryService.getCategory().pipe(first()).subscribe(res=>{
      this.categoryArr = res.data;
    },err =>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  getCity(id) {
    this.spinner.show();
    this.LocationService.singleCity(id).pipe(first()).subscribe(res => {
      this.cityArr = res.data.cityList;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
  getCountry() {
    this.LocationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  get f() { return this.empForm.controls };

  onSubmit() {
    this.empSubmitted = true;

    if (this.empForm.invalid) {
      return;
    }
    this.spinner.show();
    this.empForm.value.joiningDate =  this.empForm.value.joiningDate.day + '/' +  this.empForm.value.joiningDate.month + '/' +  this.empForm.value.joiningDate.year;
    if( this.empForm.value.resigningDate){
      this.empForm.value.resigningDate =  this.empForm.value.resigningDate.day + '/' +  this.empForm.value.resigningDate.month + '/' +  this.empForm.value.resigningDate.year;

    }
    if (this.empForm.value.id) {
      this.EmployeeService.updateEmp(this.empForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/project/employee']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.EmployeeService.createEmp(this.empForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/project/employee']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }


  singleEmp(id) {
    this.EmployeeService.singleEmp(id).pipe(first()).subscribe(res => {
      console.log(res)
      let joiningDate
      if(res.data.joiningDate){
         joiningDate = new Date(res.data.joiningDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      }
      let resigningDate;
      if(res.data.resigningDate){
         resigningDate = new Date(res.data.resigningDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      }
    
      this.empForm.patchValue({
        name: res.data.name,
        email: res.data.email,
        projectId: res.data.projectId,
        employeeCode: res.data.employeeCode,
        addressLine1: res.data.addressLine1,
        addressLine2: res.data.addressLine2,
        countryId: res.data.countryId,
        cityId: res.data.cityId,
        fathersName:res.data.fathersName,
        stateId: res.data.stateId,
        id: res.data.id,
        postalCode: res.data.postalCode,
        contactNo: res.data.contactNo,
        wages: res.data.wages,
        wagesType: res.data.wagesType,
        category:res.data.category,
        designation:res.data.designation,
       
       
        
      })
      if(joiningDate){
        this.empForm.patchValue({
          joiningDate:{ day: joiningDate.getDate(), month: joiningDate.getMonth() + 1, year: joiningDate.getFullYear() },
        })
      }
      if(resigningDate){
        this.empForm.patchValue({
          resigningDate:{ day: resigningDate.getDate(), month: resigningDate.getMonth() + 1, year: resigningDate.getFullYear() },
        })
      }
      if(res.data.countryId){
        this.getState(res.data.countryId);
      }
      if(res.data.stateId){
      this.getCity(res.data.stateId);
      }
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

  horizontalWizardStepperPrevious() {
    this.stepper.previous();
  }
  gotoAddressDetails() {
    this.empSubmitted = true;
    if (this.empForm.value.name && this.empForm.value.email && this.empForm.value.contactNo && this.empForm.value.wages && this.empForm.value.projectId && this.empForm.value.wagesType && this.empForm.value.fathersName && this.empForm.value.wagesType && this.empForm.value.employeeCode && this.empForm.value.designation && this.empForm.value.category && this.empForm.value.joiningDate) {
      this.empSubmitted = false;
      this.stepper.next();

    }
  }

  getProject() {
    $('#manage-table').DataTable().clear().destroy();
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      $(document).ready(function() {
        $('#manage-table').DataTable({
        "iDisplayLength": 100
      });
      });
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }
  // gotoAddressDetails() {
  //   this.empSubmitted = true;
  //   console.log(this.empForm.value);
  //   if (this.empForm.value.addressLine1 && this.empForm.value.addressLine2 && this.empForm.value.countryId && this.empForm.value.cityId && this.empForm.value.stateId && this.empForm.value.postalCode) {
  //     this.empSubmitted = false;
  //     this.stepper.next();
  //   }

  // }
}









