import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { AssettypeService } from '../asset-type/asset-type.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { ContractorService } from '../../contractor-form/contractor.service';
import { AdvanceService } from './advance.service';

declare let $: any;

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  assetTypeArr = [];
  advanceArray = [];
  advanceForm: FormGroup;
  advanceSubmitted = false;
  buttonText = '';
  advanceId = '';
  projectArr = [];
  contractArray = [];
  id:any;
 
 
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    
    private assetType: AssettypeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private contractorService:ContractorService,
    private advanceService: AdvanceService, 
    private ManageProjectService: ManageProjectService,
    private Toastr: ToastrService,
   
    ) { } 

  ngOnInit(): void {
     this.spinner.show();
    this.advanceForm = this.formBuilder.group({
      projectId: [null, Validators.required],
      subContractorId: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, Validators.required],
      notes: [null, Validators.required],
      advanceType: [null,Validators.required],
      id: null,
    });
    this.advanceGet();
    this.getContractorAdvance();
    this.getProject();
    // this.advanceGetType();

  }
  // Modal Open Function
  advanceModel(modal: any) {
    this.buttonText = "Submit";
    this.advanceForm.reset({});

    this.advanceSubmitted = false;
    this.modalService.open(modal, { size: 'md' });
  }
  get f() { return this.advanceForm.controls; }
  // Submit Function, Create and Update Function
  advanceSubmit(modal) {

  
    this.advanceSubmitted = true;
    if (this.advanceForm.invalid) {
      return;
    }
    this.advanceForm.value.date = this.advanceForm.value.date.day + '/' + this.advanceForm.
    value.date.month + '/' + this.advanceForm.value.date.year;
  
    this.spinner.show();
    if (this.advanceForm.value.id) {
      this.advanceService.updateAdvance(this.advanceForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.advanceGet();
        modal.dismiss('cross click');
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.advanceService.createAdvance(this.advanceForm.value).pipe(first()).subscribe(res => {
        this.advanceGet();
        this.Toastr.success(res.data);
        modal.dismiss('cross click');
      },err => {
        this.spinner.hide();
        // this.Toastr.error(err.error.error.reason);
      });
    }
  }
  // Edit Function
  advanceEdit(modal, advance) {
     let advanceDate =  new Date(advance.date.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
     let startDate = { day: advanceDate.getDate(), month: advanceDate.getMonth() + 1, year: advanceDate.getFullYear() };
    
    // this.advanceForm.reset({});
    this.advanceSubmitted = false;
    this.buttonText = "Update";
    this.advanceForm.patchValue({
      projectId: advance.projectId,
      subContractorId: advance.subContractorId,
      date: startDate,
      amount: advance.amount,
      notes: advance.notes,
      advanceType: advance.advanceTypes,
      id: advance.id
    });
    console.log(advance,this.advanceForm.value)
    // this.advanceGetType();
    this.modalService.open(modal, { size: 'sm' });
  }
  // Get Function
 advanceGet() {
    $('#advanceTable').DataTable().clear().destroy();
    this.advanceService.getAdvance().pipe(first()).subscribe(res => {
       $(document).ready(function () {
         $('#advanceTable').DataTable({
         "iDisplayLength": 100
         });
      });
      this.advanceArray = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    },err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
 getProject() {
  this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
    this.projectArr = res.data;
    console.log('project',this.projectArr)
    this.spinner.hide();
  }, err => {
    this.spinner.hide();
    this.Toastr.error(err.error.error.reason);
  })
}
getContractorAdvance(){
  this.contractorService.getContractor().pipe(first()).subscribe(res=>{
    this.contractArray = res.data;
    console.log('contractor', this.contractArray)
  })
}
  deleteModal(content, asset) {
    this.advanceId = asset.id;
    this.modalService.open(content, { size: 'md' });
  }

  // Delete Function
  advanceDelete(modal) {
    this.spinner.show();
    this.advanceService.deleteAdvance(this.advanceId).pipe(first()).subscribe(res => {
      this.advanceGet();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss('cross click');
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
  
}


