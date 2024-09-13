import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/auth/service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const currentUser:any = this._authenticationService._login();
    // const isLoggedIn = currentUser && currentUser.token;
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
    // if (isLoggedIn && isApiUrl) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `RaisoniGroup ${currentUser.token}`
    //     }
    //   });
    // }

    // return next.handle(request);
    const headersConfig = {
      // 'Content-Type': 'application/json',
      //'Accept': 'multipart/form-data'
  }
  const token = this._authenticationService._login();
  const auth_pref = this._authenticationService.auth_pref();


  if (token) {
    // alert(token)
    headersConfig['Authorization'] = `BslogiKey ${token}`
   
  }
  const _req = request.clone({ setHeaders: headersConfig });
  return next.handle(_req);
  }
}
