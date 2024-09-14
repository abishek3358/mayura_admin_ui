import { Component, OnInit } from '@angular/core';
import { LocationService } from 'app/main/admin/master/location.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  buttonText = '';
  stateArr: any = [];
  countryArr: any = [];

  constructor(
    private locationService: LocationService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
this.spinner.show();
    this.getCountry();
    this.spinner.hide();
  }
  getCountry() {
    this.locationService.getCountry().pipe(first()).subscribe(res => {
      this.countryArr = res.data;
      if (this.countryArr[0].id) {
        this.getState(this.countryArr[0].id);
      }
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  
  }

  getState(countryId: any) {
    this.locationService.getState(countryId).pipe(first()).subscribe(res => {
      this.stateArr = res.data;
      this.toastr.success(res.message);
      this.spinner.hide();
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    }
    )
  }
}

