import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ManagePasswordService } from "./manage-password.service";
import { first, takeUntil } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/auth/service";
import { CoreConfigService } from "@core/services/config.service";
import { MustMatch } from "app/auth/helpers/must-match.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-manage-password",
  templateUrl: "./manage-password.component.html",
  styleUrls: ["./manage-password.component.scss"],
})
export class ManagePasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  oldPasswordTextType: boolean;
  newPasswordTextType: boolean;
  confirmPasswordTextType: boolean;
  coreConfig: any;
  _unsubscribeAll: any;
  data: any;

  constructor(
    private _coreConfigService: CoreConfigService,
    private formBuilder: FormBuilder,
    private managePasswordService: ManagePasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private authentication: ManagePasswordService,
    private authenticationService: AuthenticationService,
    private activetedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        oldPassword: [null, Validators.required],
        newPassword: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: MustMatch("newPassword", "confirmPassword"),
      }
    );

    // Subscribe to config changes
    // this._coreConfigService.config
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((config) => {
    //     this.coreConfig = config;
    //   });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  toggleoldPasswordTextType() {
    this.oldPasswordTextType = !this.oldPasswordTextType;
  }

  togglenewPasswordTextType() {
    this.newPasswordTextType = !this.newPasswordTextType;
  }

  toggleconfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.managePasswordService
      .updateChangePassword(this.resetPasswordForm.value)
      .pipe(first())
      .subscribe(
        (res) => {
          this.router.navigate(["/login"]);
          this.toastr.success(res.data);
        },
        (err) => {
          this.toastr.error(err.error.error.reason);
        }
      );
  }

  // Unsubscribe from all subscriptions
  // this._unsubscribeAll.next();
  // this._unsubscribeAll.complete();
}
