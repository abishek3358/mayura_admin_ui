import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-forgot-password',
  templateUrl: './manage-forgot-password.component.html',
  styleUrls: ['./manage-forgot-password.component.scss']
})
export class ManageForgotPasswordComponent implements OnInit {

  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  authentication: any;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private Router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    // private spinner: NgxSpinnerService,
    private Toastr: ToastrService) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }


  /**
   * On Submit
   */


  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    // this.spinner.show();
    this.authService.forgotPassword(this.forgotPasswordForm.value).pipe(first()).subscribe(res => {
      this.Toastr.success(res.message);
      this.Router.navigate(['/login']);
      // this.spinner.hide();
    }, err => {
      if (err) {
        this.Toastr.error(err.error.error.reason);
      }
      // this.spinner.hide();
    });
  }




  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      // userNameOrEmail: ['', [Validators.required]]
      userNameOrEmail: ['', [Validators.required,Validators.email]],

    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;

    },
    err => {
      // this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
