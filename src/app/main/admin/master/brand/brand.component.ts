import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
declare let $: any;
import { first } from 'rxjs/operators';
import { BrandService } from './brand.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  brandSubmitted = false;
  brandForm: FormGroup;
  brandArr: any = [];
  buttonText: string = "";
  brandObj: any = {}
  index: any
  base64Output: string;
  title = 'angular-src';
  imageFile: any;
  imgBase64: string;
  fileBase64: string;
  imageSource: any = ''
  imagePath: any;
  base64textString = '';
  win: any
  add = false
  file = false
  reFile = false
  id: any
  fileName:any;
  show = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private brandService: BrandService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.brandForm = this.formBuilder.group({
      brandName: [null, Validators.required],
      description: [null, Validators.required],
      fileUrl: [null],
      status: [null],
      fileBase64: [null],
      fileName: [null],
      file: [null],
      filedownload: [null],
      id: [null]
    });
    this.getBrand()
  }
  //GET//
  getBrand() {
    $('#brand').DataTable().clear().destroy();
    this.brandService.getBrand().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#brand').DataTable({
          "iDisplayLength": 25
        })
      });
      this.brandArr = res.data;
      this.toastr.success(res.message);
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      }
    )
  }
  openModal(myModal: any) {
    this.file = true
    this.reFile = false
    this.add = false
    this.brandObj.fileName =null
    this.buttonText = "Submit";
    this.brandForm.reset({});
    this.brandSubmitted = false;
    this.modalService.open(myModal, { size: 'sm' });
  }
  get f() {
    return this.brandForm.controls;
  }
  onSubmit(modal) {
    this.brandSubmitted = true;
    if (this.brandForm.invalid) {
      return;
    }
    //UPDATE//
 
    if (this.brandForm.value.id) {
      this.brandService.updateBrand(this.brandForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        modal.dismiss("cross click")
        this.getBrand();
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
    //CREATE//
    else {
      this.brandService.createBrand(this.brandForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        modal.dismiss("cross click");
        this.getBrand();
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
    }
  }
  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    
    if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {

    } else {
      this.toastr.error("(jpeg, jpg, png) Files only supported")
      return;
    }

    this.brandForm.value.fileName = file.name
    this.brandObj.fileName = file.name
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  handleReaderLoaded(e: any) {
    this.base64textString = 'data:image/png;base64,' + btoa(e.target.result);
    this.brandForm.value.fileBase64 = this.base64textString
  }
  //EDIT//
  editBrand(myModal: any, id: any) {
    this.add = true;
    this.file = false;
    this.reFile = true;
    this.brandService.singleGetBrand(id).pipe(first()).subscribe(res => {
      this.brandObj = res.data;
      this.fileName = this.brandObj.fileName;
      this.brandForm.patchValue({
        brandName: res.data.brandName,
        description: res.data.description,
        id: res.data.id,
        status: res.data.status,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName
      })
    })
    this.buttonText = "Update"
    this.modalService.open(myModal, { size: 'sm' });
  }
  //DELETE//
  deleteModal(myModal, brandObj) {
    this.modalService.open(myModal, { size: 'md' });
    this.brandObj = brandObj.id;
  }
  delete(modal) {
    this.spinner.show();
    this.brandService.deleteBrand(this.brandObj).pipe(first()).subscribe(res => {
      this.getBrand();
      modal.dismiss('cross click');
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss('cross click');
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  downloadCategoryFile(fileUrl: any) {
    this.spinner.show();
    this.win = window.open(fileUrl, '_blank');
    this.win.focus();
    this.spinner.hide();
  }
}
