import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { first } from 'rxjs/operators';
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';
// import { AuthendicationService } from '../authendication.service';
// import { CoreConfigService } from '@core/services/config.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-auth-forgot-password-v2',
  templateUrl: './auth-forgot-password-v2.component.html',
  styleUrls: ['./auth-forgot-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV2Component implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // Public
  // public emailVar;
  // public coreConfig: any;
  // public forgotPasswordForm: FormGroup;
  // public submitted = false;

  // // Private
  // private _unsubscribeAll: Subject<any>;

  // /**
  //  * Constructor
  //  *
  //  * @param {CoreConfigService} _coreConfigService
  //  * @param {FormBuilder} _formBuilder
  //  *
  //  */
  // constructor(private _coreConfigService: CoreConfigService,
  //   private _formBuilder: FormBuilder,
  //   private Router: Router,
  //   private route: ActivatedRoute,
  //   private AuthendicationService: AuthendicationService,
  //   private spinner: NgxSpinnerService,
  //   private Toastr: ToastrService) {
  //   this._unsubscribeAll = new Subject();

  //   // Configure the layout
  //   this._coreConfigService.config = {
  //     layout: {
  //       navbar: {
  //         hidden: true
  //       },
  //       menu: {
  //         hidden: true
  //       },
  //       footer: {
  //         hidden: true
  //       },
  //       customizer: false,
  //       enableLocalStorage: false
  //     }
  //   };
  // }

  // // convenience getter for easy access to form fields
  // get f() {
  //   return this.forgotPasswordForm.controls;
  // }

  // /**
  //  * On Submit
  //  */


  // onSubmit() {
  //   this.submitted = true;
  //   if (this.forgotPasswordForm.invalid) {
  //     return;
  //   }
  //   this.spinner.show();
  //   this.AuthendicationService.forgotPassword(this.forgotPasswordForm.value).pipe(first()).subscribe(res => {
  //     this.Toastr.success(res.message);
  //     this.Router.navigate(['/login']);
  //     this.spinner.hide();
  //   }, err => {
  //     if (err) {
  //       this.Toastr.error(err.error.error.reason);
  //     }
  //     this.spinner.hide();
  //   });
  // }




  // // Lifecycle Hooks
  // // -----------------------------------------------------------------------------------------------------

  // /**
  //  * On init
  //  */
  // ngOnInit(): void {
  //   this.forgotPasswordForm = this._formBuilder.group({
  //     userNameOrEmail: ['', [Validators.required]]
  //   });

  //   // Subscribe to config changes
  //   this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
  //     this.coreConfig = config;

  //   });
  // }

  // /**
  //  * On destroy
  //  */
  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions
  //   this._unsubscribeAll.next();
  //   this._unsubscribeAll.complete();
  // }
}
