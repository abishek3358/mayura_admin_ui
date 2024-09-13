import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../category/category.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categorySubmitted = false;
  categoryForm: FormGroup;
  buttonText: string = "";
  categoryArr: any = [];
  categoryId = ''

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.categoryForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      id: [null]
    });
    this.getcategory();
  }

  //COUNTRY GET FUNCTION
  getcategory() {
    $('#categoryTable').DataTable().clear().destroy();

    this.categoryService.getCategory().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#categoryTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.categoryArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

  //MODAL OPEN FUNCTION
  openModal(content: any) {
    this.buttonText = "Submit";
    this.categoryForm.reset({});

    this.categorySubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }

  //EDIT MODAL
  editcategory(content, categoryData) {
    this.categoryForm.reset({});
    this.categorySubmitted = false;
    this.buttonText = "Update";
    this.categoryForm.patchValue({
      name: categoryData.name,
      description: categoryData.description,
      id: categoryData.id
    })
    this.modalService.open(content, { size: 'sm' });
  }
  get f() { return this.categoryForm.controls };

  //SUBMIT AND UPDATE FUNCTION
  onSubmit(modal) {
    this.categorySubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.categoryForm.value.id) {
      this.categoryService.updateCategory(this.categoryForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getcategory();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).pipe(first()).subscribe(res => {
        this.toastr.success(res.data);
        this.getcategory();
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }
  }
  deleteModal(content, category) {
    this.modalService.open(content, { size: 'md' });
    this.categoryId = category.id;
  }
  //DELETE FUNCTION
  delete(modal) {
    this.spinner.show();
    this.categoryService.deleteCategory(this.categoryId).pipe(first()).subscribe(res => {
      this.getcategory();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      this.spinner.hide();
      modal.dismiss("cross click");
      this.toastr.error(err.error.error.reason);
    })
  }
}

