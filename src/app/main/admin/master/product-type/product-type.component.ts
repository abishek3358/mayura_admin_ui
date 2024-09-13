import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ProductTypeService } from './product-type.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {
  productSubmitted = false;
  productForm: FormGroup;
  buttonText: string;
  productType: any = {};
  show: false;
  productCard = "ACTIVE";
  selectedTab: number = 1; 

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private producttypeService: ProductTypeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService


  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      id: [null]
    });
    this.getProduct();
  }
  openModal(content: any) {
    this.productForm.reset({});
    this.productType = {};
    this.productForm.patchValue({
      status: "ACTIVE"
    })
    this.productType.status = "ACTIVE"
    this.productSubmitted = false;
    this.modalService.open(content, { size: 'sm' });
    this.buttonText = "Submit"
  }
  get f() {
    return this.productForm.controls
  }

  productArray: any = [];
  getProduct() {
    $('#producttype').DataTable().clear().destroy();

    this.producttypeService.getProduct().pipe(first()).subscribe(res => {
      this.productArray = res.data;
      this.onActive();
      this.onTest();
      this.selectedTab = 1; 

      // $(document).ready(function () {
      //   $('#producttype').DataTable({
      //     "iDisplayLength": 25
      //   });
      // });
      this.spinner.hide();
      this.toastr.success(res.message)
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  typeProduct: any[] = []
  onActive() {
    this.selectedTab = 1; 

    this.typeProduct = this.productArray.filter((res: any) => res.status === 'ACTIVE');
    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    })
  }
  typeProducts: any[] = []
  onTest() {
    this.selectedTab = 2; 
    this.typeProducts = this.productArray.filter((res: any) => res.status === 'INACTIVE');

    if ($.fn.DataTable.isDataTable('#inActive')) {
      $('#inActive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inActive').DataTable({
        "iDisplayLength": 25
      });
    })
  }
  onSubmit(modal) {
    this.productSubmitted = true;
    if (this.productForm.invalid) {
      return;
    }

    if (this.productForm.value.id) {
      this.producttypeService.updateProduct(this.productForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        modal.dismiss("cross click")
        this.getProduct();
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
    else {
      this.producttypeService.createProduct(this.productForm.value).pipe(first()).subscribe(res => {
        this.getProduct();
        this.toastr.success(res.data)
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        });
      modal.dismiss("cross click");

    }

  }
  editproducttype(content: any, id) {
    this.producttypeService.getsingleProduct(id).pipe(first()).subscribe(res => {
      this.productForm.patchValue({
        name: res.data.name,
        description: res.data.description,
        status: res.data.status,
        id: res.data.id,
      })
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    this.buttonText = "Update"
    this.modalService.open(content, { size: 'sm' });

  }

}