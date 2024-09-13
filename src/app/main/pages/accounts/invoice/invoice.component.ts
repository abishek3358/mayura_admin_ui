import { Component, OnInit } from '@angular/core';
import { ManageProjectService } from '../../project/manage-project-form/manage-project.service';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from './../../vendor-form/vendor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from './invoice.service';
import { CustomerService } from '../../customer/customer.service';
import { ApiService } from '../../masters/unit-of-measurement/api.service';
// import {ManageProjectService} 

declare let $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  vendorArr: any = [];
  invoiceArr: any = [];
  projectArr: any = [];
  customerArr: any = [];
  uomArr: any = [];
  itemArray: any = [];
  titleArr: any = [];
  invoiceForm: FormGroup;
  WaitingFortheResponse = false;
  vendorId: any;
  invoiceId: any;
  id: any;
  projectId: any;
  invoiceFormSubmitted = false;
  project: any;
  title: any = '';

  constructor(
    private VendorService: VendorService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private router: Router,
    private invoiceService: InvoiceService,
    private ManageProjectService: ManageProjectService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private ApiService: ApiService
  ) { }

  ngOnInit(): void {
    this.invoiceForm = this.formbuilder.group({

      customerId: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      sacId: [null, Validators.required],
      referenceNo: [null, [Validators.required]],
      // percentage: [null, [Validators.required]],
      // uomName: [null, [Validators.required]],
      paymentDueDate: [null, [Validators.required]],
      invoiceNumber: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      igst: [null],
      igstPercentage: [null],
      cgst: [null],
      cgstPercentage: [null],
      sgst: [null],
      sgstPercentage: [null],
      subTotal: [null, [Validators.required]],
      totalAmount: [null, [Validators.required]],
      id: null,
      notes: [null, [Validators.required]],
      // salesInvoiceId:[null],
      // uomId:null,
      // item: [null , Validators.required],
      // rate: [null , Validators.required],
      // total: [null , Validators.required],
      workOrderDetailsId: [null, [Validators.required]],
      salesInvoiceDtlDTOList: this.formbuilder.array([
        this.formGroup()
      ]),
    });

    this.getCustomer();
    this.getProject();
    this.getUom();
    //  this.itemsAllGet();


    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.singleGetInvoice(this.id);
    }

  }
  itemsAllGet(id) {
    this.ManageProjectService.getBOQ(id).pipe(first()).subscribe(res => {
      this.itemArray = res.data;


      // if(this.project != this.invoiceForm.value.projectId){
      //   for(let i=0; i< this.itemListarr.controls.length; i++ ){
      //     this.itemListarr.controls[i].patchValue({
      //       serviceDescription:null

      //     })
      //     this.project = this.invoiceForm.value.projectId

      //   }
      // }
    })

  }
  getProject() {
    //this.spinner.show();
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
    })
  }

  formGroup() {
    return this.formbuilder.group({
      item: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      // description: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      id: null,
      salesInvoiceId: [null],
      total: [null, [Validators.required]],
      uomId: [null, [Validators.required]],
      percentage: [null, Validators.required]
    });
  }
  /* Amount Calculation Function*/
  calculateAmount(index) {
    let controlArray = this.invoiceForm.get("salesInvoiceDtlDTOList") as FormArray;
    if (this.invoiceForm.value.salesInvoiceDtlDTOList[index].rate && this.invoiceForm.value.salesInvoiceDtlDTOList[index].percentage) {
      controlArray.controls[index].patchValue({
        total: this.invoiceForm.value.salesInvoiceDtlDTOList[index].rate / this.invoiceForm.value.salesInvoiceDtlDTOList[index].percentage
      });
    }

  }

  calculateTotal() {
    let total = 0;
    setTimeout(() => {
      total = parseFloat(this.invoiceForm.value.subTotal) + parseFloat(this.invoiceForm.value.igst) + parseFloat(this.invoiceForm.value.cgst) + parseFloat(this.invoiceForm.value.sgst);


      this.invoiceForm.patchValue({
        totalAmount: total.toFixed(2)
      });
    }, 100);
  }

  calculateSubTotal() {
    let subTotal: number = 0;
    setTimeout(() => {
      for (let i = 0; i < this.invoiceListarr.length; i++) {
        subTotal += parseFloat(this.invoiceListarr.value[i].total);
      };
      this.invoiceForm.patchValue({
        subTotal: subTotal.toFixed(2)
      })
      // this.taxCalculation();
    }, 100);
  }
  taxCalculation() {
    this.invoiceForm.patchValue({
      igst: ((this.invoiceForm.value.subTotal * this.invoiceForm.value.igstPercentage) / 100).toFixed(2),

      cgst: ((this.invoiceForm.value.subTotal * this.invoiceForm.value.cgstPercentage) / 100).toFixed(2),

      sgst: ((this.invoiceForm.value.subTotal * this.invoiceForm.value.sgstPercentage) / 100).toFixed(2)
    });
    // this.calculateTotal();

  }
  // calculateAmount(index) {
  //   let controlArray = <FormArray>this.invoiceForm.controls["salesInvoiceDtlDTOList"];
  // 
  //   controlArray.controls[index].patchValue({
  //     amount: this.invoiceListarr.value[index].quantity * this.invoiceListarr.value[index].rate
  //   });


  // }

  // taxCalculation() {
  //   this.invoiceForm.patchValue({
  //     igst:((this.invoiceForm.value.subTotal * this.invoiceForm.value.igstPercentage) / 100).toFixed(2),
  //     cgst: ((this.invoiceForm.value.subTotal * this.invoiceForm.value.cgstPercentage) / 100).toFixed(2),
  //     sgst: ((this.invoiceForm.value.subTotal * this.invoiceForm.value.sgstPercentage) / 100).toFixed(2)
  //   });
  //   this.calculateTotal();
  // }
  // calculateTotal() {
  //   setTimeout(() => {
  //   let total = this.invoiceForm.value.subTotal + this.invoiceForm.value.igst + this.invoiceForm.value.cgst + this.invoiceForm.value.sgst;
  //   total = parseFloat(total).toFixed(2);
  //   this.invoiceForm.patchValue({
  //     totalAmount: total
  //   })
  //   }, 100);
  // }
  // calculateSubTotal() {
  //   let subTotal:number = 0;
  //   setTimeout(() => {
  //     for (let i = 0; i < this.invoiceListarr.length; i++) {
  //       subTotal += parseFloat(this.invoiceListarr.value[i].amount);
  //     };
  //    
  //     this.invoiceForm.patchValue({
  //       subTotal: subTotal.toFixed(2)
  //     })
  //   }, 100);
  // }


  get f() {
    return this.invoiceForm.controls;
  }

  get invoiceListarr(): FormArray {
    return this.invoiceForm.get('salesInvoiceDtlDTOList') as FormArray
  }

  add() {
    this.invoiceListarr.push(this.formGroup());
  }

  getCustomer() {

    this.customerService.getCustomer().pipe(first()).subscribe(res => {
      this.customerArr = res.data;

    });

  }

  getSacCode(event) {

    setTimeout(()=>{
      for (let item of this.itemArray) {
        if (event == item.id) {
          this.title = item.serviceDescription;
          this.invoiceForm.patchValue({
            sacId: item.sacId,
          })
        }
      }
    },1000)
  

   
 
  }
  getUom() {
    this.ApiService.getuommethod().pipe(first()).subscribe(res => {
      this.uomArr = res.data;

    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }



  deleteterm(index) {
    if (this.invoiceListarr.length == 1) {
      this.Toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.invoiceListarr.removeAt(index);
      this.calculateSubTotal();
      this.Toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }

  onSubmit() {
    this.invoiceFormSubmitted = true;
    if (this.invoiceForm.invalid) {
      return;
    }
    this.spinner.show();
    this.invoiceForm.value.invoiceDate = this.invoiceForm.value.invoiceDate.day + '/' + this.invoiceForm.value.invoiceDate.month + '/' + this.invoiceForm.value.invoiceDate.year;
    this.invoiceForm.value.paymentDueDate = this.invoiceForm.value.paymentDueDate.day + '/' + this.invoiceForm.value.paymentDueDate.month + '/' + this.invoiceForm.value.paymentDueDate.year;
    if (this.invoiceForm.value.id) {
      this.invoiceService.updateInvoice(this.invoiceForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.message);
        this.router.navigate(['app/accounts/invoice/view/' + '/' + this.id]);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.invoiceService.createInvoice(this.invoiceForm.value).pipe(first()).subscribe(res => {
        this.Toastr.success(res.message);
        this.invoiceArr = res.data;
        this.spinner.hide();
        this.router.navigate(['app/accounts/invoice/view/' + res.data]);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });

    }
  }
  singleGetInvoice(id) {
    this.invoiceService.singleGetInvoice(id).pipe(first()).subscribe(res => {
      this.invoiceArr = res.data;

      let delivery = new Date(res.data.invoiceDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let invoiceDate = { day: delivery.getDate(), month: delivery.getMonth() + 1, year: delivery.getFullYear() };
      let end = new Date(res.data.paymentDueDate.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));

      let paymentDueDate = { day: end.getDate(), month: end.getMonth() + 1, year: end.getFullYear() };

      this.invoiceListarr.controls = [];
      this.title = res.data.workOrderDetailsId;
      for (let invoice of res.data.salesInvoiceDtlDTOList) {
        this.invoiceListarr.push(this.formGroup());
      }
      this.invoiceForm.patchValue({
        // serviceDescription: res.data.serviceDescription,
        customerId: res.data.customerId,
        id: res.data.id,
        workOrderDetailsId: res.data.workOrderDetailsId,
        referenceNo: res.data.referenceNo,
        invoiceNumber: res.data.invoiceNumber,
        invoiceDate: invoiceDate,
        paymentDueDate: paymentDueDate,
        projectId: res.data.projectId,
        notes: res.data.notes,
        salesInvoiceDtlDTOList: res.data.salesInvoiceDtlDTOList,
        subTotal: res.data.subTotal,
        cgst: res.data.cgst,
        cgstPercentage: res.data.cgstPercentage,
        igst: res.data.igst,
        igstPercentage: res.data.igstPercentage,
        sgst: res.data.sgst,
        sgstPercentage: res.data.sgstPercentage,
        totalAmount: res.data.totalAmount,
        percentage: res.data.percentage,
        uomId: res.data.uomId,
        total: res.data.total,
      });
      this.itemsAllGet(res.data.projectId);
      // setTimeout(()=>{
      //   this.getTitle();
      // },1000)
      // this.calculateSubTotal();

      this.spinner.hide();
      this.Toastr.success(res.message)
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

}
