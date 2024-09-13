import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { LocationService } from './../../masters/location.service';
import { PlantMachineryFormService } from './plant-machinery-form.service';
import { VehicleTypeService } from './../../masters/vehicle-type/vehicle-type.service';
import { AssettypeService } from './../../masters/asset-type/asset-type.service';
import { AssetserviceService } from './../../masters/asset/assetservice.service';
import { ManageProjectService } from '../../../pages/project/manage-project-form/manage-project.service';

declare let $: any;

@Component({
  selector: 'app-plant-machinery-form',
  templateUrl: './plant-machinery-form.component.html',
  styleUrls: ['./plant-machinery-form.component.scss']
})
export class PlantMachineryFormComponent implements OnInit {
  public contentHeader: object;
  private modernWizardStepper: Stepper;
  plantMachineryFormsubmitted = false;
  plantMachineryForm: FormGroup;
  plantMachineryFormbuttonText: string = "";
  plantMachineryFormObj: {};
  // plantMachineryFormArr: any = [];
  assetArr: any = [];
  plantArr: any = [];
  vechileArr: any = [];
  assetSelectArr: any = [];
  assetTypeArr: any = [
    "ASSET",
    "HIRE"
  ];
  assetType:any;
  asset= false;
  hire= false;
  jobCode: any;
  projectArr: any = [];
  id: any;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private location: LocationService,
    private VehicleTypeService: VehicleTypeService,
    private AssettypeService: AssettypeService,
    private AssetService: AssetserviceService,
    private ManageProjectService: ManageProjectService,
    private PlantMachineryFormService: PlantMachineryFormService,
    private Toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {});

    this.plantMachineryForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      assetId: [null, [Validators.required]],
      assetType: [null, [Validators.required]],
      id: [null],
      closingReading: [null, [Validators.required]],
      date: [null, [Validators.required]],
      fuel: [null, [Validators.required]],
      // hire: [null, [Validators.required]],
      name: [null, [Validators.required]],
      startReading: [null, [Validators.required]],
      projectId:[null,[Validators.required]],
      totelHours: [null, [Validators.required]],
      vehicletypeId: [null, [Validators.required]],
    });
    let id = this.router.snapshot.params['id'];
    if (id) {
      this.singlePlantMachinery(id);
    }
    // this.getList();
    this.getAsset();
    this.getVechile();
    this.getProject();
  }
  get f() { return this.plantMachineryForm.controls };

  selectAsset(event){
    this.assetType = event;
    if (this.assetType == 'HIRE') {
  
      this.plantMachineryForm.removeControl('assetId');  
        this.plantMachineryForm.addControl('hire', this.formBuilder.control('', Validators.required));
    }
    // if (this.assetType == 'ASSET') {
    
    // }
    if (this.assetType == 'ASSET') {
      this.plantMachineryForm.removeControl('hire');
      this.plantMachineryForm.addControl('assetId', this.formBuilder.control('', Validators.required));
    }
    // if (this.assetType == 'HIRE') {
     
    // }
  }

  selectLocation() {
    if (this.plantMachineryForm.value.assetType == 'ASSET') {
      this.asset = true;
    } else {
      this.asset = false;
    }
    if (this.plantMachineryForm.value.assetType == 'HIRE') {
      this.hire = true;
    } else {
      this.hire = false;
    }
  }


  onSubmit() {
    this.plantMachineryFormsubmitted = true;

    this.plantMachineryForm.value.date = this.plantMachineryForm.value.date.day + '/'
      + this.plantMachineryForm.value.date.month + '/'
      + this.plantMachineryForm.value.date.year;

    if (this.plantMachineryForm.invalid) {
      return;
    }
    this.spinner.show()
    if (this.plantMachineryForm.value.id) {
      this.PlantMachineryFormService.updatePlantMachinery(this.plantMachineryForm.value).pipe(first()).subscribe(async res => {
        this.plantArr = res.data;
        this.Toastr.success(res.data);
        this.route.navigate(['app/project/plant/machinery']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    } else {
      this.PlantMachineryFormService.createPlantMachinery(this.plantMachineryForm.value).pipe(first()).subscribe(async res => {
        this.Toastr.success(res.data);
        this.route.navigate(['app/project/plant/machinery']);
      }, err => {
        this.spinner.hide();
        this.Toastr.error(err.error.error.reason);
      });
    }
  }
  singlePlantMachinery(id) {
    this.PlantMachineryFormService.getSinglePlantMachinery(id).pipe(first()).subscribe(res => {
      this.assetSelectArr = res.data;

      if (res.data.date) {
        var toDate = res.data.date.split('/');
        let date = new Date(toDate[1] + '-' + toDate[0] + ' ' + toDate[2]);
        res.data.date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
      }
      if (this.assetSelectArr.assetType == 'HIRE') {
        this.asset = false;
        this.plantMachineryForm.removeControl('assetId');  
        this.plantMachineryForm.addControl('hire', this.formBuilder.control('', Validators.required));
        this.hire = true;
      } else {
        this.hire = false;
      }
      if (this.assetSelectArr.assetType == 'ASSET') {
        this.asset = true;
      } else {
        this.asset = false;
      }
      this.plantMachineryForm.patchValue({
        assetId: res.data.assetId,
        assetType: res.data.assetType,
        id: res.data.id,
        closingReading: res.data.closingReading,
        amount: res.data.amount,
        date: res.data.date,
        fuel: res.data.fuel,
        hire: res.data.hire,
        name: res.data.name,
        startReading: res.data.startReading,
        totelHours: res.data.totelHours,
        projectId:res.data.projectId,
        vehicletypeId: res.data.vehicletypeId,
      })
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }

  next() {
    this.plantMachineryFormsubmitted = true;
    if (this.plantMachineryForm.value.amount && this.plantMachineryForm.value.name
      
      && this.plantMachineryForm.value.assetType
      && this.plantMachineryForm.value.fuel 
      && this.plantMachineryForm.value.totelHours) {
      this.plantMachineryFormsubmitted = false;
      this.modernWizardStepper.next();
    }
  }
  previous() {
    this.modernWizardStepper.previous();
  }


  // getList() {
  //   this.PlantMachineryFormService.getPlantMachinery().pipe(first()).subscribe(res => {
  //     this.plantMachineryFormArr = res.data;
  //     this.spinner.hide();
  //     this.Toastr.success(res.message);
  //   }, error => {
  //     this.spinner.hide();
  //     this.Toastr.error(error);
  //   })
  // }
  getAsset() {
    this.AssetService.assetGet().pipe(first()).subscribe(res => {
      this.assetArr = res.data;
    });
  }
  getVechile() {
    this.VehicleTypeService.getVehicle().pipe(first()).subscribe(res => {
      this.vechileArr = res.data;
    });
  }
  getProject() {
    $('#manage-table').DataTable().clear().destroy();
    this.ManageProjectService.getProject().pipe(first()).subscribe(res => {
      this.projectArr = res.data;
      $(document).ready(function() {
        $('#manage-table').DataTable({
        "iDisplayLength": 100
      });
      });
    
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }


}
