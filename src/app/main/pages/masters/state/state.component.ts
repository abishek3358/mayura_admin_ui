import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare let $: any;
@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  // stateForm: FormGroup;
  // buttonText = '';
  // stateSubmitted = false;
  // stateArr: any = [];
  // countryArr: [];
  // stateId = '';
  constructor(
    // private formBuilder: FormBuilder,
    // private modalService: NgbModal,
    // private LocationService: LocationService,
    // private Toastr: ToastrService,
    // private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  //   this.spinner.show();
  //   this.stateForm = this.formBuilder.group({
  //     name: [null, Validators.required],
  //     shortName: [null, Validators.required],
  //     countryId: [null, Validators.required],
  //     id: [null],

  //   });
  //   this.getState();
  //   this.getcountry();
  // }
  // get f() { return this.stateForm.controls };

  // //GET STATE FUNCTION 
  // getState() {
  //   $('#state-table').DataTable().clear().destroy();
  //   this.LocationService.getState().pipe(first()).subscribe(res => {
  //     $(document).ready(function () {
  //       $('#state-table').DataTable({
  //         "iDisplayLength": 100
  //       });
  //     });
  //     this.stateArr = res.data;
  //     this.spinner.hide();
  //     this.Toastr.success(res.message);
  //   }, err => {
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  // //GET COUNTRY FUNCTION
  // getcountry() {
  //   this.LocationService.getCountry().pipe(first()).subscribe(res => {
  //     this.countryArr = res.data;
  //   }, err => {
  //     this.Toastr.error(err.error.error.reason);
  //   })
  // }
  // //MODAL OPEN FUNCTION
  // openModal(content: any) {
  //   this.buttonText = "Submit";
  //   this.stateForm.reset({});
  //   this.stateSubmitted = false;
  //   this.modalService.open(content, { size: 'sm' });
  // }
  // //EDIT MODAL
  // editState(content, state) {
  //   this.stateForm.reset({});
  //   this.stateSubmitted = false;
  //   this.buttonText = "Update";
  //   this.stateForm.patchValue({
  //     name: state.name,
  //     shortName: state.shortName,
  //     countryId: state.countryId,
  //     id: state.id
  //   })
  //   this.modalService.open(content, { size: 'sm' });
  // }
  // //SUBMIT AND UPDATE FUNCTION
  // onSubmit(modal) {
  //   this.stateSubmitted = true;
  //   if (this.stateForm.invalid) {
  //     return;
  //   }
  //   this.spinner.show();
  //   if (this.stateForm.value.id) {
  //     this.LocationService.updateState(this.stateForm.value).pipe(first()).subscribe(res => {
  //       this.getState();
  //       modal.dismiss("cross click");
  //       this.Toastr.success(res.data);
  //     }, err => {
  //       this.spinner.hide();
  //       this.Toastr.error(err.error.error.reason);
  //     });
  //   } else {
  //     this.LocationService.createState(this.stateForm.value).pipe(first()).subscribe(res => {
  //       this.getState();
  //       modal.dismiss("cross click");
  //       this.Toastr.success(res.data);
  //     }, err => {
  //       this.spinner.hide();
  //       this.Toastr.error(err.error.error.reason);
  //     });
  //   }
  // }
  // deleteModal (content,state){
  //   this.modalService.open(content, { size: 'md' });
  //   this.stateId = state.id
  // }
  // //DELETE FUNCTION
  // delete(modal) {
  //   this.spinner.show();
  //   this.LocationService.deleteState(this.stateId).pipe(first()).subscribe(res => {
  //     this.spinner.hide();
  //     modal.dismiss("cross click");
  //     this.Toastr.success(res.data);
  //     this.getState();
  //   }, err => {
  //     modal.dismiss("cross click");
  //     this.spinner.hide();
  //     this.Toastr.error(err.error.error.reason);
  //   });
  }

}
