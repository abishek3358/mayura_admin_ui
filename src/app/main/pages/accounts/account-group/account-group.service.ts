import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupService {

  private _baseUrl = environment.apiUrl + 'api/account/group/';
  private _createAccountGroup = this._baseUrl + 'create';
  private _getAccountGroup = this._baseUrl + 'get';
  private _getAllAccountGroup = this._baseUrl + 'get/all';
  private _updateAccountGroup = this._baseUrl + 'update';
  private _deleteAccountGroup = this._baseUrl + 'delete';
  private _getChatOfAccount = this._baseUrl + 'chart/of/account';
  constructor(private http: HttpClient) { }
  getAccountGroup() {
    return this.http.get<any>(this._getAllAccountGroup);
  }
  getChatOfAccount(){
    return this.http.get<any>(this._getChatOfAccount);
  }
  getSingleAccountGroup(id) {
    return this.http.get<any>(this._getAccountGroup + '/' + id);
  }

  createAccountGroup(data) {
    return this.http.post<any>(this._createAccountGroup, data);
  }

  updateAccountGroup(data) {
    return this.http.put<any>(this._updateAccountGroup, data);
  }

  deleteData(id) {
    return this.http.delete(this._deleteAccountGroup + '/' + id);
  }
}
