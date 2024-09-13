import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountGroupService } from './account-group.service';
import { CurrencyService } from './../../masters/currency/currency.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';

declare let $: any;

@Component({
  selector: 'app-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.scss']
})
export class AccountGroupComponent implements OnInit {
  accountGroupSubmitted = false;
  accountGroupForm: FormGroup;
  buttonText: string = "";
  accountGroupObj: {};
  accountGroupArr: any = [];
  currencyArray: any = [];
  accountArray: any = [];
  currencyId;
  accountGroupArray: any = [];
  userName: any;
  accoutGroupId: any;
  id: any;
  accountGroupDropdownListArray: any = [];
  accountGroupId = "";
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private AccountGroupService: AccountGroupService,
    private CurrencyService: CurrencyService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.accountGroupForm = this.formBuilder.group({
      name: [null, Validators.required],
      shortName: [null, Validators.required],
      accountId: [null],
      currencyId: [null, Validators.required],
      description: [null, Validators.required],
      id: [null],
    });
    this.getAccountGroupList();
    this.getCurrency();
    this.getAccountGroupDropdownList();
  }

  openModal(content: any) {
    this.buttonText = "Submit";
    this.accountGroupForm.reset({});
    this.accountGroupObj = {};
    this.accountGroupSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }
  get f() { return this.accountGroupForm.controls };
  onSubmit(modal) {
    this.accountGroupSubmitted = true;
    if (this.accountGroupForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.accountGroupForm.value.id) {
      this.AccountGroupService.updateAccountGroup(this.accountGroupForm.value).pipe(first()).subscribe(async res => {
        this.getAccountGroupList();
        modal.dismiss('Cross click');
        this.Toastr.success(res.data);
      }, err => {
        modal.dismiss('Cross click');
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      })
    } else {
      this.AccountGroupService.createAccountGroup(this.accountGroupForm.value).pipe(first()).subscribe(async res => {
        this.getAccountGroupList();
        modal.dismiss('Cross click');
        this.Toastr.success(res.data);
      }, err => {
        modal.dismiss('Cross click');
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      })
    }

  }
  getAccountGroupList() {
    this.AccountGroupService.getChatOfAccount().pipe(first()).subscribe(res => {
      this.accountGroupArray = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  getAccountGroupDropdownList() {
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      this.accountGroupDropdownListArray = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  closeModal() {
    $('#productTypeModal').modal('hide');
    this.accountGroupObj = {};
    this.accountGroupSubmitted = false;
  }
  editAccountGroup(content, values) {
    this.buttonText = "Update"
    this.accountGroupSubmitted = false;
    this.accountGroupForm.reset({});
    let id;
    if (values.id) {
      id = values.id;
    } else {
      id = values.accountId;
    }
this.spinner.show();
    this.AccountGroupService.getSingleAccountGroup(id).pipe(first()).subscribe(res => {
      if (values.id) {
        this.accountGroupForm.patchValue({
          name: res.data.name,
          shortName: res.data.shortName,
          accountId: res.data.accountId,
          currencyId: res.data.currencyId,
          description: res.data.description,
          id: res.data.id,
          })
      } else {
        this.accountGroupForm.patchValue({
          accountId: res.data.id,
          })
      }
    
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
      // modal.dismiss('Cross click');
    })
    // if(values.id) {
    //   this.accountGroupForm.patchValue({
    //     name: values.accountName,
    //     accountId: values.id
    //   })
    // }else {
    //   this.accountGroupForm.patchValue({
    //     accountId: values.accountId
    //   })
    // }
    this.modalService.open(content, { size: 'sm' });
  }
  openModall(content, accoutGroupId,) {
    if (accoutGroupId) {
      this.accoutGroupId = accoutGroupId;
      this.modalService.open(content, { size: 'sm' });
    }
  }
  deleteAccountGroup(modal,subAccount){
    this.modalService.open(modal,{size:'md'});
    this.accountGroupId = subAccount.id;
  }
  deleteData(modal) {
    this.AccountGroupService.deleteData(this.accountGroupId).pipe(first()).subscribe((res: any) => {
      // modal.dismiss('Cross click');
      this.spinner.hide();
      this.Toastr.success(res.data);
      modal.dismiss("cross click");
      this.getAccountGroupList();
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
      // modal.dismiss('Cross click');
    })
  }

  select(event) {
    this.currencyId = event.id;
  }

  getCurrency() {
    this.CurrencyService.getCurrency().pipe(first()).subscribe(res => {
      this.currencyArray = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}


