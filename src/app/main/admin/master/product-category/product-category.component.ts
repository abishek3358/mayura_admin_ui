import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategoryService } from './product-category.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { ProductTypeService } from '../product-type/product-type.service';
import { timeStamp } from 'console';
declare let $: any;

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})

export class ProductCategoryComponent implements OnInit {
  productSubmitted = false;
  productForm: FormGroup;
  buttonText = '';
  index: any
  base64Output: string;
  title = 'angular-src';
  imageFile: any;
  imgBase64: string;
  fileBase64: string;
  imageSource: any = ''
  imagePath: any;
  base64textString = '';
  productCategory: any = [];
  category: any = {};
  productObj: any = {};
  win: any
  add = false;
  file = false;
  reFile = false;
  selectedCar = "ACTIVE";

  selectedTab: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private productService: ProductCategoryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer,
    private productTypeService: ProductTypeService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      shortName: [null, Validators.required],
      productTypeId: [null, Validators.required],
      description: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      fileUrl: [null],
      fileBase64: [null],
      fileName: [null],
      file: [null],
      filedownload: [null],
      fileupload: [null],
      id: [null],

    });
    this.getProductCategory();
    this.getProducttype()
    this.selectedTab = 1;


  }
  // getProductCategory() {
  //   $('#product').DataTable().clear().destroy();
  //   this.productService.getProductCategory().pipe(first()).subscribe(res => {
  //     this.productArr = res.data;
  //     $(document).ready(function () {
  //       $('#product').DataTable({
  //         "iDisplayLength":25
  //       });
  //     });
  //     this.spinner.hide();
  //     this.toastr.success(res.message);
  //   }, err => {
  //     this.spinner.hide();
  //     this.toastr.error(err.error.error.reason);
  //   })
  // }

  getAllProduct: any = [];
  getProductCategory() {
    $('#productCategory').DataTable().clear().destroy();
    this.productService.getProductCategory().pipe(first()).subscribe(res => {
      this.getAllProduct = res.data;
      this.onActive();
      this.inActive();
      this.selectedTab = 1;

      $(document).ready(function () {
        $('#productCategory').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  productArr: any[] = []
  onActive() {
    this.selectedTab = 1;

    this.productArr = this.getAllProduct.filter((res: any) => res.status === 'ACTIVE');
    if ($.fn.DataTable.isDataTable('#active')) {
      $('#active').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#active').DataTable({
        "iDisplayLength": 25
      });
    });
  }
  productArray: any[] = []
  inActive() {
    this.selectedTab = 2;

    this.productArray = this.getAllProduct.filter((res: any) => res.status === 'INACTIVE');
    if ($.fn.DataTable.isDataTable('#inActive')) {
      $('#inActive').DataTable().destroy();
    }
    $(document).ready(function () {
      $('#inActive').DataTable({
        "iDisplayLength": 25
      });
    });
  }
  openModal(content: any) {
    this.productForm.reset({});
    this.productObj = {};
    this.productForm.patchValue({
      status: "ACTIVE"
    })
    this.productObj.status = "ACTIVE"
    this.buttonText = "Submit";
    this.productSubmitted = false;
    this.add = false
    this.file = true
    this.reFile = false
    this.modalService.open(content, { size: 'sm' });
  }
  get f() {
    return this.productForm.controls
  }
  onsubmit(modal) {
    this.productSubmitted = true;
    if (this.productForm.invalid) {
      return;
    }
    if (this.productForm.value.id) {
      this.add = true
      this.file = false

      this.productService.updateProductCategory(this.productForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getProductCategory();
        this.getProducttype();
        modal.dismiss("cross click");
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        });
    }

    else {
      this.productService.createProductCategory(this.productForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getProductCategory();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }
  }

  onUploadChange(evt: any) {

    const file = evt.target.files[0];
    if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {

    } else {
      this.toastr.error("(jpeg, jpg, png) Files only supported")
      return;
    }
    this.productForm.value.fileName = file.name
    this.productObj.fileName = file.name

    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.base64textString = 'data:image/png;base64,' + btoa(e.target.result);
    this.productForm.value.fileBase64 = this.base64textString
  }

  editProductCategory(content: any, id: any) {

    this.add = true;
    this.file = false
    this.reFile = true

    this.productService.singleProductCategory(id).pipe(first()).subscribe(res => {



      this.productObj = res.data;
      this.productForm.patchValue({
        name: res.data.name,
        shortName: res.data.shortName,
        productTypeId: res.data.productTypeId,
        description: res.data.description,
        status: res.data.status,
        id: res.data.id,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName


      })

    })
    this.buttonText = "Update"
    this.modalService.open(content, { size: 'sm' });
  }
  getProducttype() {
    this.productTypeService.getProduct().pipe(first()).subscribe(res => {
      this.productCategory = res.data
    })
  }
  downloadCategoryFile(fileUrl: any) {
    this.spinner.show();

    this.win = window.open(fileUrl, '_blank');
    this.win.focus();
    this.spinner.hide();
  }






  // }

}
