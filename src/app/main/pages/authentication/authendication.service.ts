import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthendicationService {
  private _baseUrl = environment.apiUrl + 'auth/'
  private _login = this._baseUrl + 'login'
  private _userDetail = this._baseUrl + 'user-details'

  private _forgot = environment.apiUrl + '/api/user/send/password'
  private _changePassword = environment.apiUrl + '/api/user/change/password'

  // private _token = new Subject<string>();
  // token$ = this._token.asObservable();
  constructor(
    private http: HttpClient
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
  changePassword(data) {
    return this.http.put<any>(this._changePassword, data);
  }

}
