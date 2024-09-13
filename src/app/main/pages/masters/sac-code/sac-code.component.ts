import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SacCodeService } from './sac-code.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;

@Component({
  selector: 'app-sac-code',
  templateUrl: './sac-code.component.html',
  styleUrls: ['./sac-code.component.scss']
})
export class SacCodeComponent implements OnInit {
  sacCodeSubmitted = false;
  sacCodeForm: FormGroup;
  buttonText: string = "";
  sacCodeObj: {};
  sacCodeArr: any = [];
  userName: any;
  id: any;
  sacId: any;

  constructor(
    private formBuilder: FormBuilder, private modalService: NgbModal,
    private SacCodeService: SacCodeService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.sacCodeForm = this.formBuilder.group({
      igst: [null, Validators.required],
      sgst: [null, Validators.required],
      cgst: [null, Validators.required],
      hsnSacCode: [null, Validators.required],
      description: [null, Validators.required],
      id: [null],
    });
    this.getsacCodeList();
  }

  openModal(content: any) {
    this.buttonText = "Submit";
    this.sacCodeForm.reset({});
    this.sacCodeObj = {};
    this.sacCodeSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }
  get f() { return this.sacCodeForm.controls };

  onSubmit(modal) {
    this.sacCodeSubmitted = true;
    if (this.sacCodeForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.sacCodeForm.value.id) {
      this.SacCodeService.updateSacCode(this.sacCodeForm.value).pipe(first()).subscribe(async res => {
        this.getsacCodeList();
        modal.dismiss('Cross click');
        this.Toastr.success(res.data);
      }, err => {
        modal.dismiss('Cross click');
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.SacCodeService.createSacCode(this.sacCodeForm.value).pipe(first()).subscribe(async res => {
        this.getsacCodeList();
        modal.dismiss('Cross click');
        this.Toastr.success(res.data);
      }, err => {
        modal.dismiss('Cross click');
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  getsacCodeList() {
    $('#sacCode').DataTable().clear().destroy();
    this.SacCodeService.getSacCode().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#sacCode').DataTable({
          "iDisplayLength": 100
        });
      });
      this.sacCodeArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }
  closeModal() {
    $('#productTypeModal').modal('hide');
    this.sacCodeObj = {};
    this.sacCodeSubmitted = false;
  }
  editsacCode(content, values) {
    this.buttonText = "Update";
    this.sacCodeSubmitted = false;
    this.sacCodeForm.patchValue({
      igst: values.igst,
      sgst: values.sgst,
      cgst: values.cgst,
      hsnSacCode: values.hsnSacCode,
      description: values.description,
      id: values.id
    })
    this.modalService.open(content, { size: 'sm' });
  }
  openModall(content, sacId,) {

      this.sacId = sacId;
      this.modalService.open(content, { size: 'sm' });
    
  }

  deleteData(modal) {
    this.spinner.show();
    this.SacCodeService.deleteData(this.sacId).pipe(first()).subscribe((res: any) => {
      this.Toastr.success(res.data);
      this.getsacCodeList();
      modal.dismiss('Cross click');
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
      modal.dismiss('Cross click');
    })
  }
}

