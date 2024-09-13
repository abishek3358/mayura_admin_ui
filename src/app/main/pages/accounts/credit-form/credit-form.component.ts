import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from './../../vendor-form/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { first, map } from 'rxjs/operators';
import { ManageProjectService } from '../../../pages/project/manage-project-form/manage-project.service';
import { AccountGroupService } from '../../accounts/account-group/account-group.service';
import { LocationService } from '../../../pages/masters/location.service';
import { identity, interval, Observable, Subject } from 'rxjs';
import { CreditService } from '../credit/credit.service';
import { SubContractWorkOrderService } from './../../sub-contract-work-order-form/sub-contract-work-order.service';
import moment from 'moment';
declare let $: any;
// interface Person{
//   itemCode: string;
//   itemDescription: string;
//   id: string;
// }
@Component({
  selector: 'app-credit-form',
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.scss']
})
export class CreditFormComponent implements OnInit {
  creditForm: FormGroup;
  creditFormSubmitted = false;
  vendorArr: any = [];
  projectArr: any = [];
  accountGroupArray: any = [];
  itemArr: any = [];
  id: any[];
  titleArr: any = [];
  project: any

  // public items$: Observable<Person[]>;
  public input$ = new Subject<string | null>();

  constructor(private formBuilder: FormBuilder,
    private Router: Router,
    private route: ActivatedRoute,
    private VendorService: VendorService,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ManageProjectService: ManageProjectService,
    private AccountGroupService: AccountGroupService,
    private LocationService: LocationService,
    private CreditService: CreditService,
    private SubContractWorkOrderService: SubContractWorkOrderService
  ) {
    //   var header = $("header"),
    //   yOffset = 0,
    //   triggerPoint = 150;
    // $(window).scroll(function () {
    //   yOffset = $(window).scrollTop();

    //   if (yOffset >= triggerPoint) {
    //     header.addClass("minimized");
    //   } else {
    //     header.removeClass("minimized");
    //   }
    // });

    // this.items$ = this.input$.pipe(
    //   map((term) => this.searchPeople(term))
    // );
  }

  // searchPeople(term: string | null): Person[] {
  //   const searchTerm = term ? term : '';
  //   return this.itemArr.filter((person) => {
  //     return person.itemDescription.toLowerCase().startsWith(searchTerm.toLowerCase());
  //   });
  // }

  ngOnInit(): void {
    this.spinner.show();
    this.creditForm = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      jobCode: [null],
      billNo: [null, [Validators.required]],
      transactionDate: [null, [Validators.required]],
      transactionReferenceNo: [null, [Validators.required]],
      vendorId: [null, [Validators.required]],
      accountGroupId: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      igst: [0],
      igstPer: [null],
      cgst: [0],
      cgstPer: [null],
      sgst: [0],
      sgstPer: [null],
      total: [null, [Validators.required]],
      subTotal: [null, [Validators.required]],
      id: [null],
      creditNoteDTLDTOList: this.formBuilder.array([
        this.formGroup()
      ]),
    });
    let id = this.route.snapshot.params['id'];
    if (id != undefined && id != "new") {
      this.singleCredit(id);
    }
    this.getVendor();
    this.getProject();
    this.getAccountGroupList();

    // this.calculateSubTotal(); 
  }


  getVendor() {
    this.VendorService.getVendor().pipe(first()).subscribe(res => {

      this.vendorArr = res.data;
      this.spinner.hide();
      // this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    })
  }

  // getState(id) {
  //   this.spinner.show();
  //   this.LocationService.singleState(id).pipe(first()).subscribe(res => {
  //     this.stateArr = res.data.stateList;
  //     this.spinner.hide();
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   });
  // }

  getItem() {
    this.SubContractWorkOrderService.getItem(this.creditForm.value.projectId).pipe(first()).subscribe(res => {
      this.itemArr = res.data;
      if (this.project != this.creditForm.value.projectId) {
        for (let i = 0; i < this.itemListarr.controls.length; i++) {
          this.itemListarr.controls[i].patchValue({
            workOrderDetailsId: null

          })
          this.project = this.creditForm.value.projectId

        }
      }
    })

  }

  getProject() {
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }




  getAccountGroupList() {
    $('#accountGroup').DataTable().clear().destroy();
    this.AccountGroupService.getAccountGroup().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#accountGroup').DataTable({
          "iDisplayLength": 100
        });
      });
      this.accountGroupArray = res.data;

      this.spinner.hide();
      // this.Toastr.success(res.message);
    }, error => {
      this.spinner.hide();
      this.Toastr.error(error);
    })
  }



  get f() {
    return this.creditForm.controls;
  }

  formGroup() {
    return this.formBuilder.group({
      item: [null],
      id: [null],
      workOrderDetailsId: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      unitRate: [null, [Validators.required]],
      creditNoteId: [null],
      amount: [null, [Validators.required]],
    });
  }

  get itemListarr(): FormArray {
    return this.creditForm.get('creditNoteDTLDTOList') as FormArray
  }
  add() {
    this.itemListarr.push(this.formGroup());
  }

  calculateAmount(index) {
    this.itemListarr.controls[index].patchValue({
      amount: this.itemListarr.value[index].quantity * this.itemListarr.value[index].unitRate
    });
  }
  getTitle() {
    for (let i = 0; i < this.itemListarr.value.length; i++) {
      for (let j = 0; j < this.itemArr.length; j++) {
        if (this.itemListarr.value[i].workOrderDetailsId == this.itemArr[j].id) {
          this.titleArr[i] = this.itemArr[j].serviceDescription;
        }
      }
    }
  }
  titleGet(index) {

    for (let i = 0; i < this.itemArr.length; i++) {
      if (this.itemListarr.value[index].workOrderDetailsId == this.itemArr[i].id) {
        this.titleArr[index] = this.itemArr[i].serviceDescription;
      }

    }
  }

  calculateSubTotal() {
    let subTotal = 0;
    setTimeout(() => {
      for (let i = 0; i < this.itemListarr.length; i++) {
        subTotal += this.itemListarr.value[i].amount;
      }
      subTotal = parseFloat(subTotal.toFixed(2));
      this.creditForm.patchValue({
        subTotal: subTotal
      })

      this.taxCalculation();
    }, 100);
  }


  calculateTotal() {
    let total = 0;
    setTimeout(() => {
      total = parseFloat(this.creditForm.value.subTotal) + parseFloat(this.creditForm.value.igst) + parseFloat(this.creditForm.value.cgst) + parseFloat(this.creditForm.value.sgst);
      total = parseFloat(total.toFixed(2));
      this.creditForm.patchValue({
        total: total.toFixed(2)
      })
    }, 100);
  }

  taxCalculation() {
    this.creditForm.patchValue({
      igst: ((this.creditForm.value.subTotal * this.creditForm.value.igstPer) / 100).toFixed(2),
      cgst: ((this.creditForm.value.subTotal * this.creditForm.value.cgstPer) / 100).toFixed(2),
      sgst: ((this.creditForm.value.subTotal * this.creditForm.value.sgstPer) / 100).toFixed(2)
    })
    this.calculateTotal();
  }





  onSubmit() {
    // console.log(this.f.total)
    this.creditFormSubmitted = true;
    if (this.creditForm.invalid) {
      return;
    }
    this.spinner.show();

    this.creditForm.value.transactionDate = this.creditForm.value.transactionDate.day + '/' + this.creditForm.
      value.transactionDate.month + '/' + this.creditForm.value.transactionDate.year;
    if (this.creditForm.value.id) {
      this.CreditService.updateCredit(this.creditForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.Router.navigate(['app/accounts/credit']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.CreditService.createCredit(this.creditForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.data);
        this.Router.navigate(['app/accounts/credit']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }

  }

  singleCredit(id) {
    this.spinner.show();

    this.CreditService.singleCredit(id).pipe(first()).subscribe(res => {


      let trandate = new Date(res.data.transactionDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
      let transactionDate = { day: trandate.getDate(), month: trandate.getMonth() + 1, year: trandate.getFullYear() };
      this.itemListarr.controls = [];

      for (let i = 0; i < res.data.creditNoteDTLDTOList.length; i++) {
        this.itemListarr.push(this.formGroup());
      }

      this.creditForm.patchValue({
        projectId: res.data.projectId,
        jobCode: res.data.jobCode,
        billNo: res.data.billNo,
        transactionDate: transactionDate,
        transactionReferenceNo: res.data.transactionReferenceNo,
        vendorId: res.data.vendorId,
        accountGroupId: res.data.accountGroupId,
        notes: res.data.notes,
        igst: res.data.igst,
        igstPer: res.data.igstPer,
        cgst: res.data.cgst,
        cgstPer: res.data.cgstPer,
        sgst: res.data.sgst,
        sgstPer: res.data.sgstPer,
        total: res.data.total,
        subTotal: res.data.subTotal,
        id: res.data.id,
        creditNoteDTLDTOList: res.data.creditNoteDTLDTOList
      });
      this.project = res.data.projectId;
      if (this.creditForm.value.projectId != null) {
        this.getItem();
      }
      setTimeout(() => {
        this.getTitle();
      }, 1000)
      this.calculateSubTotal();


      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

  deleteterm(index) {
    if (this.itemListarr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.calculateSubTotal();
      this.itemListarr.removeAt(index);
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }
}
