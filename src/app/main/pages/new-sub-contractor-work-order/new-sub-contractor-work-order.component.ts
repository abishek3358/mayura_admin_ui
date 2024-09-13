import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ContractorService } from '../contractor-form/contractor.service';
import { ManageProjectService } from '../project/manage-project-form/manage-project.service';
import { SubContractorServiceService } from './sub-contractor-service.service';


@Component({
  selector: 'app-new-sub-contractor-work-order',
  templateUrl: './new-sub-contractor-work-order.component.html',
  styleUrls: ['./new-sub-contractor-work-order.component.scss']
})
export class NewSubContractorWorkOrderComponent implements OnInit {
  SCWOForm: FormGroup;
  woDetailsArr: any = [];
  submitted = false;
  projectArr: any = [];
  contractorArr: any = [];
  buttonText: string = 'Submit';
  waitingForTheResponse: boolean = false;
  subContractorBoqCodeArray: any = [];
  subContractorBoqCode: String;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private subContractorWOService: SubContractorServiceService,
    private projectService: ManageProjectService,
    private contractorService: ContractorService
  ) { }

  ngOnInit(): void {
    this.SCWOForm = this.formBuilder.group({
      bill: [null, [Validators.required]],
      contactPersonMobileNo: [null, [Validators.required]],
      contactPersonName: [null, [Validators.required]],
      contractorId: [null, [Validators.required]],
      dateOfCommencement: [null, [Validators.required]],
      dateOfCompletion: [null, [Validators.required]],
      description: [null, [Validators.required]],
      gst: [null, [Validators.required]],
      id: [null],
      incomeTaxTds: [null, [Validators.required]],
      latestAmendmentDate: [null, [Validators.required]],
      latestAmendmentNo: [null, [Validators.required]],
      liquidateDamagesForDelay: [null, [Validators.required]],
      materialAdvance: [null, [Validators.required]],
      mobilizationAdvance: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      ourReferanceDate: [null, [Validators.required]],
      ourReferanceNo: [null, [Validators.required]],
      payingAuthority: [null, [Validators.required]],
      performanceGuaratee: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      projectName: [null, Validators.required],
      recoveryOfMaterialAdvance: [null, [Validators.required]],
      recoveryOfMobilization: [null, [Validators.required]],
      recoveryOfSdRetention: [null, [Validators.required]],
      releaseOfPg: [null, [Validators.required]],
      releaseOfRaBills: [null, [Validators.required]],
      releseOfSdRetention: [null, [Validators.required]],
      workOrderDate: [null, [Validators.required]],
      workOrderNo: [null, [Validators.required]],
      projectCode: [null, [Validators.required]],
      subContractorBoqCode: [null, [Validators.required]]
    })
    if (this.route.snapshot.params["id"]) {
      this.getSingleSCWO(this.route.snapshot.params["id"]);
    }
    this.getProject();
    this.getcontractor();

  }

  get f() {
    return this.SCWOForm.controls
  }

  getWoDetails() {
    console.log(this.SCWOForm.value.projectId, this.SCWOForm.value.contractorId, this.SCWOForm.value.subContractorBoqCode)
    if(this.SCWOForm.value.projectId, this.SCWOForm.value.contractorId, this.SCWOForm.value.subContractorBoqCode){
      this.subContractorWOService.getWoDetail(this.SCWOForm.value.projectId, this.SCWOForm.value.contractorId,  this.SCWOForm.value.subContractorBoqCode).pipe(first()).subscribe(res => {
        this.woDetailsArr = res.data.subContractoWorkOrderBoqDtlList;
        this.waitingForTheResponse = true;
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
    if (this.SCWOForm.value.projectId && this.SCWOForm.value.contractorId ) {
      this.subContractorWOService.getSubContractorBoqCode(this.SCWOForm.value.projectId, this.SCWOForm.value.contractorId).pipe(first()).subscribe(res => {
        this.subContractorBoqCodeArray = res.data;
        console.log(this.subContractorBoqCodeArray)
      }, err => {

        this.Toastr.error(err.error.error.reason)
      });
    }
  }
  getProject() {
    this.projectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    })
  }
  getcontractor() {
    this.contractorService.getContractor().pipe(first()).subscribe(res => {
      this.contractorArr = res.data
    })
  }
  getSingleSCWO(id) {
    this.subContractorWOService.getSingleWo(id).pipe(first()).subscribe(res => {
      let dateOfCommencement = new Date(res.data.dateOfCommencement.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let dateOfCompletion = new Date(res.data.dateOfCompletion.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let ourReferanceDate = new Date(res.data.ourReferanceDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let workOrderDate = new Date(res.data.workOrderDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let latestAmendmentDate = new Date(res.data.latestAmendmentDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      this.SCWOForm.patchValue({
        bill: res.data.bill,
        contactPersonMobileNo: res.data.contactPersonMobileNo,
        contactPersonName: res.data.contactPersonName,
        contractorId: res.data.contractorId,
        contractorName: res.data.contractorName,
        dateOfCommencement: { day: dateOfCommencement.getDate(), month: dateOfCommencement.getMonth() + 1, year: dateOfCommencement.getFullYear() },
        dateOfCompletion: { day: dateOfCompletion.getDate(), month: dateOfCompletion.getMonth() + 1, year: dateOfCompletion.getFullYear() },
        description: res.data.description,
        gst: res.data.gst,
        id: res.data.id,
        incomeTaxTds: res.data.incomeTaxTds,
        latestAmendmentDate: { day: latestAmendmentDate.getDate(), month: latestAmendmentDate.getMonth() + 1, year: latestAmendmentDate.getFullYear() },
        latestAmendmentNo: res.data.latestAmendmentNo,
        liquidateDamagesForDelay: res.data.liquidateDamagesForDelay,
        materialAdvance: res.data.materialAdvance,
        mobilizationAdvance: res.data.mobilizationAdvance,
        notes: res.data.notes,
        ourReferanceDate: { day: ourReferanceDate.getDate(), month: ourReferanceDate.getMonth() + 1, year: ourReferanceDate.getFullYear() },
        ourReferanceNo: res.data.ourReferanceNo,
        payingAuthority: res.data.payingAuthority,
        performanceGuaratee: res.data.performanceGuaratee,
        projectCode: res.data.projectCode,
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        recoveryOfMaterialAdvance: res.data.recoveryOfMaterialAdvance,
        recoveryOfMobilization: res.data.recoveryOfMobilization,
        recoveryOfSdRetention: res.data.recoveryOfSdRetention,
        releaseOfPg: res.data.releaseOfPg,
        releaseOfRaBills: res.data.releaseOfRaBills,
        releseOfSdRetention: res.data.releseOfSdRetention,
        subContractorprojectName: res.data.subContractorprojectName,
        workOrderDate: { day: workOrderDate.getDate(), month: workOrderDate.getMonth() + 1, year: workOrderDate.getFullYear() },
        workOrderNo: res.data.workOrderNo,
        subContractorBoqCode: res.data.subContractorBoqCode


      })
      setTimeout(()=>{
        this.getWoDetails();
      },10)
      
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.SCWOForm.invalid) {
      return;
    }
    this.spinner.show();
    this.SCWOForm.value.workOrderDate = this.SCWOForm.value.workOrderDate.day + '/' + this.SCWOForm.
      value.workOrderDate.month + '/' + this.SCWOForm.value.workOrderDate.year;
    this.SCWOForm.value.latestAmendmentDate = this.SCWOForm.value.latestAmendmentDate.day + '/' + this.SCWOForm.
      value.latestAmendmentDate.month + '/' + this.SCWOForm.value.latestAmendmentDate.year;
    this.SCWOForm.value.ourReferanceDate = this.SCWOForm.value.ourReferanceDate.day + '/' + this.SCWOForm.
      value.ourReferanceDate.month + '/' + this.SCWOForm.value.ourReferanceDate.year;
    this.SCWOForm.value.dateOfCommencement = this.SCWOForm.value.dateOfCommencement.day + '/' + this.SCWOForm.
      value.dateOfCommencement.month + '/' + this.SCWOForm.value.dateOfCommencement.year;
    this.SCWOForm.value.dateOfCompletion = this.SCWOForm.value.dateOfCompletion.day + '/' + this.SCWOForm.
      value.dateOfCompletion.month + '/' + this.SCWOForm.value.dateOfCompletion.year;
    console.log(this.SCWOForm.value);
    if (this.SCWOForm.value.id) {
      this.subContractorWOService.updateWO(this.SCWOForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/sub/contract']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.subContractorWOService.createWO(this.SCWOForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.router.navigate(['app/sub/contract']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      })
    }
  }

}
