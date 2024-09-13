import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, UrlTree, CanActivateChild } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { AuthService } from 'app/main/admin/authentication/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private authService: AuthService, private _authService: AuthenticationService) { }

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const currentUser = this._authenticationService.currentUserValue;
    const currentUser = localStorage.getItem('token');
    // console.log(this._authenticationService.currentUserValue);
    // alert("hi")
    if (currentUser) {
      if (JSON.parse(localStorage.getItem("currentUser")).role !== "Admin") {
        this._router.navigate(['/login']);
        return false;
      }
      //   if (state.url == '/login') {
      //     this._router.navigate(['/dashboard']);
      //     return false;
      // }
      // check if route is restricted by role
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      // role not authorised so redirect to not-authorized page
      //   this._router.navigate(['/pages/miscellaneous/not-authorized']);
      //   return false;
      // }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   let url: string = state.url;
  //   return this.checkUserLogin(next, url);
  // }
  // public canActivateChild(route: ActivatedRouteSnapshot): boolean {
  //   console.log(JSON.parse(localStorage.getItem("currentUser")).role);
  //   if (JSON.parse(localStorage.getItem("currentUser")).role === "Admin") {
  //     return true;
  //   } else {
  //     this._router.navigate(['/login']);
  //     return false;
  //   }
  // }
  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }

  // checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     const userRole = this.authService.getRole();
  //     if (route.data.role && route.data.role.indexOf(userRole) === -1) {
  //       this._router.navigate(['/home']);
  //       return false;
  //     }
  //     return true;
  //   }

  //   this._router.navigate(['/home']);
  //   return false;
  // }
}
