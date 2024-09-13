import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{environment} from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ManagePasswordService {
 private baseUrl = environment.apiUrl + 'auth/change/';
 private _updateChangePassword = this.baseUrl + 'password'
//  private baseurl1 = environment.apiUrl + 'auth/signup'

 

  constructor(
    private http:HttpClient,
    ) { }
    updateChangePassword(data:any){
      return this.http.put<any>(this._updateChangePassword,data)
    }
    // signup(data:any){
    //   return this.http.post<any>(this.baseurl1,data)

    // }
    logout() {
      localStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('config');
    }
}
