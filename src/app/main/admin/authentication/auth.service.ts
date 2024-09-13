import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    throw new Error('Method not implemented.');
  }

  private _baseUrl = environment.apiUrl + 'auth/'

  private _login = this._baseUrl + 'login'

  private _userDetail = this._baseUrl + 'user-details'

  private _forgot = environment.apiUrl + 'auth/send/password'

  isLogin = false;
    
  roleAs: string;


  constructor(
    private http:HttpClient
  ) { }

  login(data) {
    return this.http.post<any>(this._login, data);

  }
  userDetail() {
        return this.http.get<any>(this._userDetail);
  }
  forgotPassword(data) {
    return this.http.put<any>(this._forgot, data);
  }


  
  // loginUser(value: string) {
  //   this.isLogin = true;
  //   this.roleAs = value;
  //   localStorage.setItem('STATE', 'true');
  //   localStorage.setItem('ROLE', this.roleAs);
  //   return of({ success: this.isLogin, role: this.roleAs });
  // }

  // logout() {
  //   this.isLogin = false;
  //   this.roleAs = '';
  //   localStorage.setItem('STATE', 'false');
  //   localStorage.setItem('ROLE', '');
  //   return of({ success: this.isLogin, role: '' });
  // }

  // isLoggedIn() {
  //   const loggedIn = localStorage.getItem('STATE');
  //   if (loggedIn == 'true')
  //     this.isLogin = true;
  //   else
  //     this.isLogin = false;
  //   return this.isLogin;
  // }

  // getRole() {
  //   this.roleAs = localStorage.getItem('ROLE');
  //   return this.roleAs;
  // }

}
