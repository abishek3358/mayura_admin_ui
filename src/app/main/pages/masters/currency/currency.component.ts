import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { CurrencyService } from './currency.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare let $: any;

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  currencyArr: any = [];
  currencyForm: FormGroup;
  currencySubmitted = false;
  buttonText: string = '';
  currencyId = '';
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private currencyService: CurrencyService,
    private toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currencyForm = this.formBuilder.group({
      name: [null, Validators.required],
      baseCurrency: [null, Validators.required],
      code: [null, Validators.required],
      conversionRate: [null, Validators.required],
      symbol: [null, Validators.required],
      id: [null]
    });
    this.getCurrency();
  }
  //form countrol for validation
  get f() {
    return this.currencyForm.controls
  }

  // MODAL OPEN FUNCTION
  openModal(content: any) {
    this.buttonText = "Submit";
    this.currencyForm.reset({});

    this.currencySubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }
  //EDIT MODAL
  editcountry(content, currency) {
    this.currencyForm.reset({});
    this.currencySubmitted = false;
    this.buttonText = "Update";
    this.currencyForm.patchValue({
      name: currency.name,
      baseCurrency: currency.baseCurrency,
      code: currency.code,
      conversionRate: currency.conversionRate,
      symbol: currency.symbol,
      id: currency.id
    })
    this.modalService.open(content, { size: 'sm' });
  }
  //GET CURRENCY 
  getCurrency() {
    $('#country').DataTable().clear().destroy();
    this.currencyService.getCurrency().pipe(first()).subscribe(res => {
      this.currencyArr = res.data;
      $(document).ready(function () {
        $('#country').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

  //SUBMIT AND UPDATE FUNCTION
  onSubmit(modal) {
    this.currencySubmitted = true;
    if (this.currencyForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.currencyForm.value.id) {
      this.currencyService.updateCurrency(this.currencyForm.value).pipe(first()).subscribe(res => {
        modal.dismiss("cross click");
        this.getCurrency();
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    } else {
      this.currencyService.createCurrency(this.currencyForm.value).pipe(first()).subscribe(res => {
        modal.dismiss("cross click");
        this.getCurrency();
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    }
  }
  deleteCurency(content,currency){
    this.modalService.open(content, { size: 'md' });
    this.currencyId = currency.id
  }
  //delete function
  delete(modal) {
    this.spinner.show();
    this.currencyService.deleteCurrency(this.currencyId).pipe(first()).subscribe(res => {
      this.getCurrency();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
}
