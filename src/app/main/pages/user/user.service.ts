import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _baseUrl = environment.apiUrl + 'api/user/'
  private _getuser = this._baseUrl + 'get'
  private _createuser = this._baseUrl + 'create'
  private _updateuser = this._baseUrl + 'update'
  private _deleteuser = this._baseUrl + 'delete'

  constructor(
    private http: HttpClient

  ) { }


  createUser(data) {
    return this.http.post<any>(this._createuser, data);

  }

  getUser() {
    return this.http.get<any>(this._getuser);
  }

  updateUser(data) {
    return this.http.put<any>(this._updateuser, data);
  }
  getSingleUser(userId) {
    return this.http.get<any>(this._getuser + '/' + userId);
  }
  deleteUser(userId) {
    return this.http.delete<any>(this._deleteuser + '/' + userId);
  }
}
