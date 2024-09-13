import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../masters/location.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor(
    private LocationService: LocationService
  ) { }

  ngOnInit(): void {
    //for authorization purpose
    this.getCity()
  }
  getCity() {
    this.LocationService.getCity().pipe(first()).subscribe(res => {

    })
  }

}
