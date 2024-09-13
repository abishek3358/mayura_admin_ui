import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  // citySubmitted = false;
  // cityForm: FormGroup;
  // buttonText: string = "";
  // cityArr: any = [];
  // stateArr: any = [];
  // cityId = ''

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private modalService: NgbModal,
  //   private LocationService: LocationService,
  //   private Toastr: ToastrService,
  //   private spinner: NgxSpinnerService
  // ) { }

  ngOnInit(): void {
    // this.spinner.show();
    // this.cityForm = this.formBuilder.group({
    //   name: [null, Validators.required],
    //   shortName: [null, Validators.required],
    //   stateId: [null, Validators.required],
    //   id: [null]
    // });

    // this.getCity();
    // this.getState();
  }
  //CITY GET FUNCTION
  // getCity() {
  //   $('#city-table').DataTable().clear().destroy();
  //   this.LocationService.getCity().pipe(first()).subscribe(res => {
  //     $(document).ready(function () {
  //       $('#city-table').DataTable({
  //         "iDisplayLength": 100
  //       });
  //     });
  //     this.cityArr = res.data;
  //     this.spinner.hide();
  //     this.Toastr.success(res.message);
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  //STATE GET FUNCTION
  // getState() {
  //   this.LocationService.getState().pipe(first()).subscribe(res => {
  //     this.stateArr = res.data;
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  // //CREATE MODAL OPEN FUNCTION
  // openModal(content: any) {
  //   this.buttonText = "Submit";
  //   this.cityForm.reset({});
  //   this.citySubmitted = false;
  //   this.modalService.open(content, { size: 'sm' });
  // }
  // //EDIT MODAL
  // editcountry(content, city) {
  //   this.cityForm.reset({});
  //   this.citySubmitted = false;
  //   this.buttonText = "Update";
  //   this.cityForm.patchValue({
  //     name: city.name,
  //     shortName: city.shortName,
  //     stateId: city.stateId,
  //     id: city.id
  //   })
  //   this.modalService.open(content, { size: 'sm' });
  // }
  // //
  // get f() { return this.cityForm.controls };

  // //CREATE AND UPDATE FUNCTION
  // onSubmit(modal) {
  //   this.citySubmitted = true;
  //   if (this.cityForm.invalid) {
  //     return;
  //   }
  //   this.spinner.show();
  //   if (this.cityForm.value.id) {
  //     this.LocationService.updateCity(this.cityForm.value).pipe(first()).subscribe(res => {
  //       this.getCity();
  //       this.Toastr.success(res.data);
  //       modal.dismiss("cross click");
  //     }, err => {
  //       this.spinner.hide();
  //       this.Toastr.error(err.error.error.reason);
  //       });
  //   } else {
  //     this.LocationService.createCity(this.cityForm.value).pipe(first()).subscribe(res => {
  //       this.getCity();
  //       modal.dismiss("cross click");
  //       this.Toastr.success(res.data);
  //     }, err => {
  //       this.spinner.hide();
  //       this.Toastr.error(err.error.error.reason);
  //       });
  //   }

  // }
  // deleteModal(content,city){
  //   this.modalService.open(content, { size: 'md' });
  //   this.cityId = city.id;
  // }
  // //DELETE FUNCTION
  // delete(modal) {
  //   this.spinner.show();
  //   this.LocationService.deleteCity(this.cityId).pipe(first()).subscribe(res => {
  //     this.getCity();
  //     modal.dismiss('cross click');
  //     this.Toastr.success(res.data);
  //   }, err => {
  //     modal.dismiss('cross click');
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
}

