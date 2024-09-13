import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  // countrySubmitted = false;
  // countryForm: FormGroup;
  // buttonText: string = "";
  // countryArr: any = [];
  // countryId = '';

  constructor(
    // private formBuilder: FormBuilder,
    // private modalService: NgbModal,
    // private LocationService: LocationService,
    // private toastr: ToastrService,
    // private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
//     this.spinner.show();
//     this.countryForm = this.formBuilder.group({
//       name: [null, Validators.required],
//       shortName: [null, Validators.required],
//       id: [null]
//     });
//     this.getcountry();
//   }

//   //COUNTRY GET FUNCTION
//   getcountry() {
//     $('#country').DataTable().clear().destroy();

//     this.LocationService.getCountry().pipe(first()).subscribe(res => {
//       $(document).ready(function () {
//         $('#country').DataTable({
//           "iDisplayLength": 100
//         });
//       });
//       this.countryArr = res.data;
//       this.spinner.hide();
//       this.toastr.success(res.message);
//     }, err => {
//       this.spinner.hide();
//       this.toastr.error(err.error.error.reason);
//     })
//   }

//   //MODAL OPEN FUNCTION
//   openModal(content: any) {
//     this.buttonText = "Submit";
//     this.countryForm.reset({});

//     this.countrySubmitted = false;
//     this.modalService.open(content, { size: 'sm' });
//   }

//   //EDIT MODAL
//   editcountry(content, country) {
//     this.countryForm.reset({});
//     this.countrySubmitted = false;
//     this.buttonText = "Update";
//     this.countryForm.patchValue({
//       name: country.name,
//       shortName: country.shortName,
//       id: country.id
//     })
//     this.modalService.open(content, { size: 'sm' });
//   }
//   get f() { return this.countryForm.controls };

//   //SUBMIT AND UPDATE FUNCTION
//   onSubmit(modal) {
//     this.countrySubmitted = true;
//     if (this.countryForm.invalid) {
//       return;
//     }
//     this.spinner.show();
//     if (this.countryForm.value.id) {
//       this.LocationService.updateCountry(this.countryForm.value).pipe(first()).subscribe(res => {
//         this.toastr.success(res.data);
//         this.getcountry();
//         // this.Toastr.success(res.data);
//         modal.dismiss("cross click");
//       }, err => {
//         this.spinner.hide();
//         this.toastr.error(err.error.error.reason);
//         });
//     } else {
//       this.LocationService.createCountry(this.countryForm.value).pipe(first()).subscribe(res => {
//         this.toastr.success(res.data);
//         this.getcountry();
//         modal.dismiss("cross click");
//       }, err => {
//         this.spinner.hide();
//         this.toastr.error(err.error.error.reason);
//         });
//     }
//   }
//   deleteModal(content,country){
//     this.modalService.open(content, { size: 'md' });
//     this.countryId = country.id
//   }

//   //DELETE FUNCTION
//   delete(modal) {
//     this.spinner.show();
//     this.LocationService.deleteCountry(this.countryId).pipe(first()).subscribe(res => {
//       this.getcountry();
//       modal.dismiss("cross click");
//       this.toastr.success(res.data);
//     }, err => {
//       this.spinner.hide();
//       modal.dismiss("cross click");
//       this.toastr.error(err.error.error.reason);
//     })
   }
}
  