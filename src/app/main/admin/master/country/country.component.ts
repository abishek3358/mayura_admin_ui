import { Component, OnInit } from "@angular/core";
import { LocationService } from "app/main/admin/master/location.service";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.scss"],
})
export class CountryComponent implements OnInit {
  buttonText: string = "";
  countryArr: any = [];

  constructor(
    private locationService: LocationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getcountry();
  }

  getcountry() {
    this.locationService
      .getCountry()
      .pipe(first())
      .subscribe(
        (res) => {
          this.countryArr = res.data;
          this.toastr.success(res.message);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
  }
}
