import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { CompanyContactsService } from './company-contacts.service';
declare let $: any;
@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.component.html',
  styleUrls: ['./company-contacts.component.scss']
})
export class CompanyContactsComponent implements OnInit {

  cmpcontactSubmitted = false;
  cmpcontactForm: FormGroup;
  buttonText: string = "";
  cmpcontactArr: any = [];
  contactId = '';
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private CompanyContactsService: CompanyContactsService,

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.cmpcontactForm = this.formBuilder.group({
      name: [null, Validators.required],
      roleName: [null, Validators.required],
      mobileNo: [null, Validators.required],
      email: [null, Validators.required],
      id: [null]
    });
    this.getCmpcontacts();
  }

  //MODAL OPEN FUNCTION
  openModal(content: any) {
    this.buttonText = "Submit";
    this.cmpcontactForm.reset({});
    this.cmpcontactSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }

  get f() { return this.cmpcontactForm.controls };

  onSubmit(modal) {
    this.cmpcontactSubmitted = true;
    if (this.cmpcontactForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.cmpcontactForm.value.id) {
      this.CompanyContactsService.updateCmpcontacts(this.cmpcontactForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getCmpcontacts();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    } else {
      this.CompanyContactsService.createCmpcontacts(this.cmpcontactForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getCmpcontacts();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }
  }

  //Company Contact GET FUNCTION
  getCmpcontacts() {
    this.CompanyContactsService.getCmpcontacts().pipe(first()).subscribe(res => {
      this.cmpcontactArr = res.data;
      this.spinner.hide();
      // this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

  //EDIT MODAL
  editCmpcontacts(content, cmpcontact) {
    this.cmpcontactForm.reset({});
    this.cmpcontactSubmitted = false;
    this.buttonText = "Update";
    this.cmpcontactForm.patchValue({
      name: cmpcontact.name,
      roleName: cmpcontact.roleName,
      mobileNo: cmpcontact.mobileNo,
      email: cmpcontact.email,
      id: cmpcontact.id
    })
    this.modalService.open(content, { size: 'sm' });
  }
  deleteModal(content,contacts){
    this.modalService.open(content, { size: 'md' });
    this.contactId = contacts.id
  }

  //DELETE FUNCTION
  delete(modal) {
    this.spinner.show();
    this.CompanyContactsService.deleteCmpcontacts(this.contactId).pipe(first()).subscribe(res => {
      this.getCmpcontacts();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      this.spinner.hide();
      modal.dismiss("cross click");
      this.toastr.error(err.error.error.reason);
    })
  }

}
