import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  cityFormSubmitted = false;
  cityForm: FormGroup;
  buttonText: string = "";
  cityArr: any = [];
  stateArr: any = [];
  cityId = '';
  stateId = '';
  countryId = '';
  countryArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private locationService: LocationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.cityForm = this.formBuilder.group({
      name: [null, Validators.required],
      shortName: [null, Validators.required],
      stateId: [null, Validators.required],
      countryId: [null, Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      zipCode: [null, Validators.required],
      id: [null]
    });

    this.getCity(this.stateId);
    this.getcountry();

  }

  getCity(stateId) {
    $('#citytable').DataTable().clear().destroy();
    this.locationService.getAllCity().pipe(first()).subscribe(res => {
      this.cityArr = res.data;
      $(document).ready(function () {
        $('#citytable').DataTable({
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

  getState(countryId: any) {
    this.locationService.getState(countryId).pipe(first()).subscribe(res => {
      this.stateArr = res.data;
      if (this.stateArr[0].id) {
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getcountry() {

    this.locationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
      if (this.countryArr[0].id) {
        this.getState(this.countryArr[0].id);
      }
    })
  }
  openModal(myModalId: any) {
    this.buttonText = "Submit";
    this.cityForm.reset({});
    this.cityFormSubmitted = false;
    this.modalService.open(myModalId, { size: 'sm' });
  }

  editCity(myModalId, id) {
    this.locationService.getSingleCity(id).pipe(first()).subscribe(res => {
      this.cityForm.reset({});
      this.cityFormSubmitted = false;
      this.cityForm.patchValue({
        name: res.data.name,
        shortName: res.data.shortName,
        longitude: res.data.longitude,
        latitude: res.data.latitude,
        stateId: res.data.stateId,
        zipCode: res.data.zipCode,
        countryId: res.data.countryId,
        id: res.data.id
      })
    })
    this.buttonText = "Update";
    this.modalService.open(myModalId, { size: 'sm' });
  }

  get f() { return this.cityForm.controls };

  onSubmit(modal) {
    this.cityFormSubmitted = true;
    if (this.cityForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.cityForm.value.id) {
      this.locationService.updateCity(this.cityForm.value).pipe(first()).subscribe(res => {
        this.getCity(this.stateId);
        modal.dismiss("cross click");
        this.spinner.hide();
        console.log(res.data);
        
        this.toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    } else {
      this.locationService.createCity(this.cityForm.value).pipe(first()).subscribe(res => {
        this.getCity(this.stateId);
        this.spinner.hide();
        this.toastr.success(res.data);
        modal.dismiss("cross click");
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      });
    }
  }
  deleteModal(myModalId, city) {
    this.modalService.open(myModalId, { size: 'md' });
    this.cityId = city.id;
  }

  delete(modal) {
    this.spinner.show();
    this.locationService.deleteCity(this.cityId).pipe(first()).subscribe(res => {
      this.getCity(this.stateId);
      this.toastr.success(res.data);
      modal.dismiss('cross click');
    }, err => {
      modal.dismiss('cross click');
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
}
