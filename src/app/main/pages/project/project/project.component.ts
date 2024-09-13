import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { LocationService } from '../../masters/location.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

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
