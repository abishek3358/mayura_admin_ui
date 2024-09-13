import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from "rxjs/operators";

declare let $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userArr: any = [];

  constructor(
    private userservice: UserService,
    private router: Router, private Toastr: ToastrService,
    private Spinner: NgxSpinnerService,


  ) { }

  ngOnInit(): void {
    this.Spinner.show();
    this.getUser();
  }

  getUser() {
    $('#user-table').DataTable().clear().destroy();

    this.userservice.getUser().pipe(first()).subscribe(res => {
      this.userArr = res.data;
      $(document).ready(function () {
        $('#user-table').DataTable({
          "iDisplayLength": 100
        });
      });
      this.Spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err);
    });
  }
  editUser(id) {
    this.Spinner.show();
    this.router.navigate(['app/user/' + id]);
  }

  deleteUser(id) {
    this.Spinner.show();
    this.userservice.deleteUser(id).pipe(first()).subscribe(res => {
      this.getUser();
      this.Toastr.success(res.data);
    }, err => {
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

}
