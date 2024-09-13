import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ManageUserService } from "../manage-user.service";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { MustMatch } from "app/auth/helpers/must-match.validator";
@Component({
  selector: "app-manage-user",
  templateUrl: "./manage-user.component.html",
  styleUrls: ["./manage-user.component.scss"],
})
export class ManageUserComponent implements OnInit {
  usersForm: FormGroup;
  usersFormSubmitted = false;
  id: any;
  constructor(
    private formBuilder: FormBuilder,
    private _userService: ManageUserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activateRouter : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.activateRouter.snapshot.paramMap.get('id');
    console.log(this.id);
    
    this.usersForm = this.formBuilder.group(
      {
        fullName: [null, [Validators.required]],
        email: [null, [Validators.required]],
        mobileNo: [
          null,
          [
            Validators.required,
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
        userName: [null, [Validators.required]],
        userRole: [null, [Validators.required]],
        password: [null, [Validators.required]],
        userId: [null],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      }
    );
  }
  get f() {
    return this.usersForm.controls;
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  togglePasswordText() {
    this.passwordText = !this.passwordText;
  }
  onSubmit() {
    this.usersFormSubmitted = true;

    // if ((this.usersForm.value.password && this.usersForm.value.confirmPassword) && (this.usersForm.value.password != this.usersForm.value.confirmPassword)) {
    //   this.mustMatch = true;
    //   return;
    // }

    if (this.usersForm.invalid) {
      return;
    }
    this._userService
      .createUser(this.usersForm.value)
      .pipe(first())
      .subscribe(
        (res) => {
          this.router.navigate(["admin/users"]);
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        }
      );
  }
  public passwordTextType: boolean;
  public passwordText: boolean;
}
