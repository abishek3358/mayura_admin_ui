import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { PlantMachinaryService } from './plant-machinary.service';

declare let $: any;

@Component({
  selector: 'app-plant-machinary',
  templateUrl: './plant-machinary.component.html',
  styleUrls: ['./plant-machinary.component.scss']
})
export class PlantMachinaryComponent implements OnInit {
  plantMachinerySubmitted = false;
  plantMachineryForm: FormGroup;
  buttonText: string = "";
  plantMachineryObj: {};
  plantMachineryArr: any = [];
  userName: any;
  id: any;
  projectId: any;
  plantId = '';
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: Router,
    private router: ActivatedRoute,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private PlantMachinaryService: PlantMachinaryService
  ) { }


  ngOnInit(): void {
    this.spinner.show();
    this.getList();
  }
  openModal(content: any) {
    this.buttonText = "Submit";
    this.plantMachineryForm.reset({});
    this.plantMachineryObj = {};
    this.plantMachinerySubmitted = false;
    this.modalService.open(content, { size: 'sm' });
  }
  openpage(id) {
    this.spinner.show();
    this.route.navigate(['app/project/plant/machinery/new']);
  }
  editAccountGroup(id) {
    this.spinner.show();
    this.route.navigate(['app/project/plant/machinery' + '/' + id]);
  }
  getList() {
    $('#plantMachinery').DataTable().clear().destroy();
    this.PlantMachinaryService.getPlantMachinery().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#plantMachinery').DataTable({
          "iDisplayLength": 100
        });
      });
      this.plantMachineryArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
  openModall(content, projectId) {
    this.projectId = projectId;
    this.modalService.open(content, { size: 'sm' });
  }
  deleteModal (content,plantId){
    this.modalService.open(content,{size:'md'});
    this.plantId = plantId
  }
  deleteData(modal) {
    this.PlantMachinaryService.deleteDataPlantMachinery(this.plantId).pipe(first()).subscribe((res: any) => {
      modal.dismiss('Cross click');
      this.spinner.hide();
      this.Toastr.success(res.data);
      this.getList();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
      modal.dismiss('Cross click');
    })
  }
}

