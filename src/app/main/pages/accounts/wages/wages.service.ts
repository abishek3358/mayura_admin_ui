import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WagesService {
  private _baseUrl = environment.apiUrl + 'api/payroll/';
  private _createPayroll = this._baseUrl + 'create';
  private _getPayroll = this._baseUrl + 'get';
  private _searchDetails = this._baseUrl + 'search';
  // private _singlePayrollGet = this._baseUrl + 'get/payroll';
  private _updatePayroll = this._baseUrl + 'update';
  private _deletePayroll = this._baseUrl + 'delete';
  private _viewPayroll = this._baseUrl + 'search/payroll';
  private _upload = this._createPayroll + '/file/upload';
  private _createPayment= this._baseUrl + 'record/payment/create';
  constructor(
    private http: HttpClient
  ) {}
  createPayroll(data) {
    return this.http.post<any>(this._createPayroll, data);
  }
  singlePayrollGet(id) {
    return this.http.get<any>(this._getPayroll + '/' + id);
  }
  getPayroll() {
    return this.http.get<any>(this._getPayroll);
  }
  searchPayroll(data) {
    return this.http.put<any>(this._searchDetails, data);
  }
  updatePayroll(data){
    return this.http.put<any>(this._updatePayroll,data);
  }
  deletePayroll(id) {
    return this.http.delete<any>(this._deletePayroll + '/' + id);
  }
  viewPayroll(projectId,month){
   return this.http.get<any>(this._viewPayroll + '/' + projectId + '/' + month );
 }
 upload(data){
   return this.http.post<any>(this._upload,data);
 }
 paymentRecord(data){
  return this.http.post<any>(this._createPayment,data);
 }

}
