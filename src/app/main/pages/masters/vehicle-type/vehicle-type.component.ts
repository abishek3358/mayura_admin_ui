import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleTypeService } from './vehicle-type.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare let $: any;
@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleForm: FormGroup
  vehicleTypeSubmitted = false;
  buttonText: string = "";
  vehicleArr: any = [];
  vehicleId = '';
  constructor(
    private formBuilder: FormBuilder,
    private VehicleTypeService: VehicleTypeService,
    private modalService: NgbModal,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.vehicleForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      id: [null]
    })
    this.getVehicle();
  }
  get f() {
    return this.vehicleForm.controls;
  }
  getVehicle() {
    $('#vehicle-table').DataTable().clear().destroy();
    this.VehicleTypeService.getVehicle().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#vehicle-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.vehicleArr = res.data;
      this.Toastr.success(res.message);
      this.spinner.hide();
    },
    err =>{
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    }
    )
  }
  openModal(content) {
    this.buttonText = "Submit";
    this.vehicleTypeSubmitted = false;
    this.vehicleForm.reset({});
    this.modalService.open(content, { size: 'sm' })
  }
  editVehicle(content, vehicle) {
    this.vehicleForm.reset({});
    this.vehicleTypeSubmitted = false;
    this.buttonText = "Update";
    this.vehicleForm.patchValue({
      name: vehicle.name,
      id: vehicle.id
    });
    this.modalService.open(content, { size: 'sm' })
  }
  onSubmit(modal) {
    this.vehicleTypeSubmitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.vehicleForm.value.id) {
      this.VehicleTypeService.updateVehicle(this.vehicleForm.value).pipe(first()).subscribe(res => {
        modal.dismiss('cross click');
        this.getVehicle();
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.VehicleTypeService.createVehicle(this.vehicleForm.value).pipe(first()).subscribe(res => {
        modal.dismiss('cross click');
        this.getVehicle();
        this.Toastr.success(res.data);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  deleteModal(content,vehicleId){
    this.modalService.open(content,{size:'md'})
    this.vehicleId = vehicleId;
  }
  deleteVehicle(modal) {
    this.spinner.show();
    this.VehicleTypeService.deleteVehicle(this.vehicleId).pipe(first()).subscribe(res => {
      this.getVehicle();
      modal.dismiss('cross click');
      this.Toastr.success(res.data);
    }, err => {
      this.spinner.hide();
      modal.dismiss('cross click');
      this.Toastr.error(err.error.error.reason);
    });
  }
}
