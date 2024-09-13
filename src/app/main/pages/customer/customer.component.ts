import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './../masters/location.service';
import { CustomerService } from './customer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  private stepper: Stepper;
  customerForm: FormGroup;
  customerSubmitted = false;
  customerArr: any = []
  customerId = '';
  constructor(
    private formBuilder: FormBuilder,
    private CustomerService: CustomerService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private LocationService: LocationService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getCustomer()
  }
  getCustomer() {
    $('#customerTable').DataTable().clear().destroy();
    this.CustomerService.getCustomer().pipe(first()).subscribe(res => {
      this.customerArr = res.data;
      $(document).ready(function () {
        $('#customerTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  editCustomer(id) {
    this.spinner.show();
    this.route.navigate(['app/customer' + '/' + id]);
  }
  deleteModal(content, customerId) {
    this.modalService.open(content, { size: 'md' });
    this.customerId = customerId;
  }
  deleteCustomer(modal) {
    alert("akka")
    this.spinner.show();
    this.CustomerService.deleteCustomer(this.customerId).pipe(first()).subscribe(res => {
      this.getCustomer();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      console.log(err);
      this.spinner.hide();
      this.Toastr.error(err.error.reason);
    })
  }
}
