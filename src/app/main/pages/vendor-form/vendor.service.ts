import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private _baseUrl = environment.apiUrl + 'api/vendor/';
  private _createVendor = this._baseUrl + 'create';
  private _getVendor = this._baseUrl + 'get';
  private _getVendorAddress = this._getVendor + '/' + 'address';
  private _updateVendor = this._baseUrl + 'update';
  private _deleteVendor = this._baseUrl + 'delete';
  constructor(
    private http: HttpClient
  ) { }

  createVendor(data) {
    return this.http.post<any>(this._createVendor, data);
  }
  getVendor() {
    return this.http.get<any>(this._getVendor);
  }
  singleVendor(id) {
    return this.http.get<any>(this._getVendor + '/' + id);
  }
  getVendorAddress (id){
    return this.http.get<any>(this._getVendorAddress + '/' + id);
  }
  updateVendor(data) {
    return this.http.put<any>(this._updateVendor, data);
  }
  deleteVendor(id) {
    return this.http.delete<any>(this._deleteVendor + '/' + id);
  }
}
