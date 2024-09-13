import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {
  private _baseUrl = environment.apiUrl + 'api/customer/';
  private _createCustomer = this._baseUrl + 'create';
  private _getCustomer = this._baseUrl + 'get';
  private _updateCustomer = this._baseUrl + 'update';
  private _deleteCustomer = this._baseUrl + 'delete';

  constructor(
    private http: HttpClient
  ) { }
  createCustomer(data) {
    return this.http.post<any>(this._createCustomer, data);
  }
  getCustomer() {
    return this.http.get<any>(this._getCustomer);
  }
  singleCustomer(id) {
    return this.http.get<any>(this._getCustomer + '/' + id);
  }
  updateCustomer(data) {
    return this.http.put<any>(this._updateCustomer, data);
  }
  deleteCustomer(id) {
    return this.http.delete<any>(this._deleteCustomer + '/' + id)
  }
}
