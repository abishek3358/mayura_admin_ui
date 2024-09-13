import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ExecutionService } from '../execution.service';
declare let $:any;
@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.scss']
})
export class ExecutionComponent implements OnInit {
  executionForm: FormGroup;
  submitted = false;
  executionArr: any = [];
  executionId:any = '';
  buttonText:string = 'Submit';
  constructor(
    private formBuilder: FormBuilder,
    private tostr: ToastrService,
    private spinner: NgxSpinnerService,
    private modelService: NgbModal,
    private executionService: ExecutionService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.executionForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      shortName: [null, [Validators.required]]
    });
    this.executionGet();
  }
  get f() {
    return this.executionForm.controls
  }
  openModal(content) {
    this.modelService.open(content, { size: 'md' });
    this.executionForm.reset({});
    this.submitted = false;
  }
  editModal(content, execution) {
    this.modelService.open(content, { size: 'md' });
    this.executionForm.patchValue({
      name: execution.name,
      shortName: execution.shortName,
      id: execution.id
    });
    this.buttonText = 'Update';
  }
  executionGet() {
    this.executionService._executionGet().pipe(first()).subscribe(res => {
      $('#executionTable').DataTable().clear().destroy();
      $(document).ready(function () {
        $('#executionTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.executionArr = res.data;
      this.spinner.hide();
      this.tostr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.tostr.error(err.error.error.reason);
    })
  }
  onSubmit(modal) {
    this.submitted = true;
    if (this.executionForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.executionForm.value.id) {
      this.executionService._executionUpdate(this.executionForm.value).pipe(first()).subscribe(res => {
        this.tostr.success(res.data);
        modal.dismiss("Cross Click");
        this.executionGet();
      }, err => {
        modal.dismiss("Cross Click");
        this.spinner.hide();
        this.tostr.error(err.error.error.reason);
      })
    } else {
      this.executionService._executionCreate(this.executionForm.value).pipe(first()).subscribe(res => {
        this.tostr.success(res.data);
        modal.dismiss("Cross Click");
        this.executionGet();
      }, err => {
        modal.dismiss("Cross Click");
        this.spinner.hide();
        this.tostr.error(err.error.error.reason);
      });
    }
  }
  deleteModal(content, id) {
    this.modelService.open(content, { size: 'md' });
    this.executionId = id;
  }
  delete(modal){
    this.spinner.show()
    this.executionService._deleteExecution(this.executionId).pipe(first()).subscribe(res=>{
      this.tostr.success(res.data);
      this.executionGet();
      modal.dismiss("Cross Click");
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.tostr.error(err.error.error.reason);
    });
  }
}
