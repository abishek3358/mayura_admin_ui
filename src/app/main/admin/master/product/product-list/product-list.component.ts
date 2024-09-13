import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import { ProductListService } from './product-list.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProductCategoryService } from '../../product-category/product-category.service';
import { BrandService } from '../../brand/brand.service';
import { UomService } from '../../uom.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // editorConfig: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '100px',
  //   minHeight: '80px',
  //   maxHeight: '120px',
  //   width: '25rem',
  //   minWidth: '0',
  //   translate: 'yes',
  //   enableToolbar: true,
  //   showToolbar: true,
  //   placeholder: 'Enter text here...',
  //   defaultParagraphSeparator: '',
  //   defaultFontName: '',
  //   defaultFontSize: '',
  //   fonts: [
  //     { class: 'arial', name: 'Arial' },
  //     { class: 'times-new-roman', name: 'Times New Roman' },
  //     { class: 'calibri', name: 'Calibri' },
  //     { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  //   ],
  //   customClasses: [
  //     {
  //       name: 'quote',
  //       class: 'quote',
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: 'titleText',
  //       class: 'titleText',
  //       tag: 'h1',
  //     },
  //   ],


  // };
  productListSubmitted = false;
  productListForm: FormGroup;
  private modernWizardStepper: Stepper;
  public contentHeader: object;
  id: any
  stepper: any;
  productImgArr: any = ['LISTING', 'DETAILS']
  statusArr: any = ['ACTIVE', 'INACTIVE']
  index: any;
  productObj: any = {};
  productcategoryArr: any = []
  BrandArr: any = [];
  UomArr: any = []
  discountArr: any = ['NONE', 'FLAT', 'PERCENTAGE']
  productId: any
  buttonText: string = 'Submit'
  win: any;
  add = false
  base64TrimmedURL: string;
  Tag: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductListService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private ProductCategoryService: ProductCategoryService,
    private BrandService: BrandService,
    private UomService: UomService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.productObj = {}
    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getSingleProduct();

    }
    this.getProductCategory()
    this.getBrand();
    this.getUom();
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {});
    this.productListForm = this.formBuilder.group({
      productName: [null, [Validators.required]],
      productCode: [null, [Validators.required]],
      hsCode: [null, [Validators.required]],
      description: [null, [Validators.required]],
      tagsList: [null, [Validators.required]],
      brandId: [null, [Validators.required]],
      detailedDescription: [null, [Validators.required]],
      id: [null],
      productCategoryId: [null, [Validators.required]],
      productValidityInDays: [null, [Validators.required]],




      productDtlList: this.formBuilder.array([
        this.productUomformGroup()
      ]),
      productImageList: this.formBuilder.array([
        this.productImageFormGroup()
      ]),
    });

  }
  get f() { return this.productListForm.controls };

  //OnSubmit//
  onSubmit() {
    this.productListSubmitted = true;
    if (this.productListForm.invalid) {
      return;
    } else {
      if (this.productListForm.value.id) {
        this.productListForm.value.id = this.productObj.id;
        this.productObj.productDtlList = this.productDtlListArr.value;
        this.productObj.productImageList = this.productImageListArr.value;
        this.productService.updateProduct(this.productListForm.value).pipe(first()).subscribe(res => {

          this.router.navigate(['admin/master/products']);

          this.toastr.success(res.data);
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        })
      }
      // if(        this.productObj.productImageList==null
      //   ){ this.toastr.error();}
      else {
        this.add = false

        this.productService.createProduct(this.productListForm.value).pipe(first()).subscribe(res => {
          this.toastr.success(res.data);

          this.router.navigate(['admin/master/products'])

        });
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }

      }
    }
  }
  //getSingleProduct//
  getSingleProduct() {
    this.add = true

    this.productService.singleProduct(this.id).pipe(first()).subscribe(res => {
      this.productObj = res.data;
      this.productListForm.patchValue({
        id: res.data.id,
        productName: res.data.productName,
        productCode: res.data.productCode,
        hsCode: res.data.hsCode,
        productCategoryId: res.data.productCategoryId,
        productValidityInDays: res.data.productValidityInDays,
        description: res.data.description,
        tagsList: res.data.tagsList,
        brandId: res.data.brandId,
        detailedDescription: res.data.detailedDescription

      });
      const productDtlList = <FormArray>this.productListForm.controls['productDtlList'];
      productDtlList.controls = [];
      for (let i = 0; i < this.productObj.productDtlList.length; i++) {
        productDtlList.push(this.productUomformGroup());
      }
      this.productListForm.patchValue({ productDtlList: this.productObj.productDtlList });


      const productImageList = <FormArray>this.productListForm.controls['productImageList'];
      productImageList.controls = [];
      for (let i = 0; i < this.productObj.productImageList.length; i++) {
        productImageList.push(this.productImageFormGroup());
        productImageList.controls[i].get('file').clearValidators()
      }
      this.productListForm.patchValue({ productImageList: this.productObj.productImageList });

      this.spinner.hide();
      this.toastr.success(res.message);
    },
      err => {
        if (err.error.error.reason) {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      })
    this.buttonText = 'Update'
  }



  productUomformGroup() {
    return this.formBuilder.group({
      id: [null],
      quantity: [null, [Validators.required]],
      thresholdQuantity: [null, [Validators.required]],
      salesRate: [null, [Validators.required]],
      purchaseRate: [null, [Validators.required]],
      discountType: [null, [Validators.required]],
      discount: [null],
      uomId: [null, [Validators.required]]

    });

  }
  productImageFormGroup() {
    return this.formBuilder.group({
      id: [null],
      fileName: [null],
      fileBase64: [null],
      productImageType: [null, [Validators.required]],
      fileUrl: [null],
      file: [null, [Validators.required]],
      filedownload: [null]
    });
  }
  get productDtlListArr(): FormArray {
    return this.productListForm.get('productDtlList') as FormArray
  }

  addUom() {
    this.productListSubmitted = true;
    if (this.productDtlListArr.length <= 5) {
      this.productDtlListArr.push(this.productUomformGroup());
      this.productListSubmitted = false;
      return false;
    }
    else {
      this.toastr.error("Maximum row added");
      return true;
    }

  }
  deleteUom(id: any, index: any) {
    if (this.productDtlListArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.productService.deleteUom(id).pipe(first()).subscribe((res: any) => {
        this.productDtlListArr.removeAt(index);
        console.log(res);

        this.toastr.success(res.data);
        return true;
      })

    }
  }
  get productImageListArr(): FormArray {
    return this.productListForm.get('productImageList') as FormArray
  }
  addImage() {
    this.productListSubmitted = true;
    if (this.productImageListArr.length <= 5) {
      this.productImageListArr.push(this.productImageFormGroup());
      this.productListSubmitted = false;
    }
    else {
      this.toastr.error("Maximum row added");
      return true;
    }
  }

  deleteImage(id: any, index: any) {
    console.log(id);

    if (this.productImageListArr.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.productService.deleteImage(id).pipe(first()).subscribe((res: any) => {
        this.productImageListArr.removeAt(index);
        console.log(res);

        this.toastr.success(res.data);
        return true;
      })
    }
  }
  next() {
    this.productListSubmitted = true;
    if (this.productListForm.value.productName && this.productListForm.value.productCode
      && this.productListForm.value.hsCode
      && this.productListForm.value.productCategoryId
      && this.productListForm.value.productValidityInDays && this.productListForm.value.tagsList && this.productListForm.value.description && this.productListForm.value.brandId) {
      this.modernWizardStepper.next();
      this.productListSubmitted = false;
    }
  }
  previous() {
    this.modernWizardStepper.previous();
  }

  productNext() {
    this.productListSubmitted = true;
    if (this.productListForm.get("productDtlList").valid || (this.productListForm.get("productDtlList").value[0].discountType == 'NONE'
      && this.productListForm.get("productDtlList").value[0].discount == null)) {
      this.productListSubmitted = false;
      this.modernWizardStepper.next();

    }
  }
  previousUom() {
    this.modernWizardStepper.previous();
  }
  productImage() {
    this.productListSubmitted = true;
    if (this.productListForm.get("productImageList").valid) {
      this.productListSubmitted = false;
      this.modernWizardStepper.next();

    }
  }
  previousDescription() {

    this.modernWizardStepper.previous();
  }
  //ImageFileUpload//
  onImageFileupload(e: any, index: any) {

    this.index = '';
    this.index = index;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {

    } else {
      this.toastr.error("(jpeg, jpg, png) Files only supported")
      return;
    }
    let productImage = <FormArray>this.productListForm.get('productImageList');
    productImage.at(index).patchValue({ fileName: e.target.files[0].name });
    // this.productObj.name = file.name 
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = this._handleReaderLoaded.bind(this);

  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    let productImageList = <FormArray>this.productListForm.get('productImageList');

    productImageList.at(this.index).patchValue({ fileBase64: reader.result });
    console.clear()
  }


  getProductCategory() {
    this.ProductCategoryService.getProductCategory().pipe(first()).subscribe(res => {
      this.productcategoryArr = res.data;

    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  getBrand() {
    this.BrandService.getBrand().pipe(first()).subscribe(res => {
      this.BrandArr = res.data;
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  getUom() {
    this.UomService.getUom().pipe(first()).subscribe(res => {
      this.UomArr = res.data

    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
  }
  //DownloadImageFile//
  downloadImageFile(fileUrl: any) {
    this.productObj.productImageList.forEach((file: any) => {
      this.win = window.open(fileUrl);
      this.win.focus();
      this.spinner.hide();

    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
  }


}





