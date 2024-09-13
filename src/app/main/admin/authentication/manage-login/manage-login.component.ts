import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ManageUserService } from '../../users/manage-user.service';

@Component({
  selector: 'app-manage-login',
  templateUrl: './manage-login.component.html',
  styleUrls: ['./manage-login.component.scss']
})
export class ManageLoginComponent implements OnInit {

  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public submitted = false;
  public passwordTextType: boolean;
  public loading = false;
  error: string
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private Toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userService : ManageUserService
  ) {
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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.loading = true;
  //   this.spinner.show();
  //   this.authendicationService.login(this.loginForm.value).pipe(first()).subscribe(res => {
  //     localStorage.setItem('token', JSON.stringify(res.data.jwt).slice(1, -1));
  //     // localStorage.setItem('auth_pref', JSON.stringify(res.data.auth_pref).slice(1, -1));
  //     this.userDetail();
  //   }, error => {
  //     this.spinner.hide();
  //     this.loading = false;
  //     this.error = error;
  //   })
  // }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    // this.loading = true;
    // this.spinner.show();
    this.authService.login(this.loginForm.value).pipe(first()).subscribe(res => {
      this.spinner.show();
      localStorage.setItem('token', JSON.stringify(res.data.jwt).slice(1, -1));
      this.Toastr.success("Login successfully");
      // this.authendicationService.getToken(res.data.jwt);
      // setTimeout(()=>{
      //   alert(res.toString());
      // },100)
   
      // localStorage.setItem('auth_pref', JSON.stringify(res.data.auth_pref).slice(1, -1));
      this.userDetail();
    }, err => {
      this.spinner.hide();
      // this.Toastr.error(err.error.error.reason)
      // this.loading = false;
     this.error = err;
    })
    // }, error => {
    //   this.spinner.hide();
    //   this.loading = false;
    //   this.error = error;
    // })
  }
  
  userDetail() {
    this.authService.userDetail().pipe(first()).subscribe(res => {
      console.log(res);
      
      res.data.loginObj.value = {
        role: "Admin"
      }
      res.data.loginObj.role = "Admin";
      res.data.loginObj.avatar = "avatar-s-8.jpg";
      // res.data.loginObj.token = "fake-jwt-token.1"
      // this.loading = false;
      localStorage.setItem('currentUser', JSON.stringify(res.data.loginObj));
      this.userService.updateCurrentUser(res.data.loginObj);
      this.router.navigate(['/dashboard'])
        .then(() => {
          // window.location.reload();
        });
      // this.router.navigate(['/dashboard/ecommerce']);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    if(localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
    this.spinner.hide();
    // localStorage.clear();
    this.loginForm = this._formBuilder.group({
      // email: ['', [Validators.required, Validators.email]],
      userName: [null, Validators.required],
      password: ['', Validators.required]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    }
    ,
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
