import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _baseUrl = environment.apiUrl + 'api/sales/invoice/';
  private _createInvoice = this._baseUrl + 'create';
  private _getInvoice = this._baseUrl + 'get';
  private _getViewInvoice = this._baseUrl + 'get/print';
  private _updateInvoice = this._baseUrl + 'update';
  private _deleteInvoice = this._baseUrl + 'delete';
  private _createPaymentRecord = this._baseUrl + 'record/payment/create';
  private  _upload = this._baseUrl + 'file/upload';
  private _freezeInvoice = this._baseUrl + 'get/freezed/';
 
  constructor(private http: HttpClient) { }

  createInvoice(data) {
    return this.http.post<any>(this._createInvoice, data);
  }
  getInvoice() {
    return this.http.get<any>(this._getInvoice);
  }
  updateInvoice(data) {
    return this.http.put<any>(this._updateInvoice, data);
  }
  deleteInvoice(id) {
    return this.http.delete<any>(this._deleteInvoice + '/' + id);
  }
  singleGetInvoice(id) {
    return this.http.get<any>(this._getInvoice + '/' + id);
  }
  singleViewGetInvoice(id) {
    return this.http.get<any>(this._getViewInvoice + '/' + id);
  }
  createPaymentRecord(data) {
    return this.http.post<any>(this._createPaymentRecord, data);
  }
  upload(data){
    return this.http.post<any>(this._upload,data);
  }
  freezeInvice(id){
    return this.http.get<any>(this._freezeInvoice + id);
  }
  
}

