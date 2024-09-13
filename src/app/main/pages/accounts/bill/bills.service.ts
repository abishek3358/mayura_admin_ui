import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BillsService {

  _baseUrl = environment.apiUrl + 'api/bill/'

  private _createBill = this._baseUrl + 'create';
  private _getBill = this._baseUrl + 'get';
  private _updateBill = this._baseUrl + 'update';
  private _deleteBill = this._baseUrl + 'delete';
  private _createPaymentRecord = this._baseUrl + "record/payment/create"

  constructor(private http: HttpClient) { }

  createBill(data: any) {
    return this.http.post<any>(this._createBill, data);
  }

  getBill() {
    return this.http.get<any>(this._getBill);
  }

  getSingleBill(id) {
    return this.http.get<any>(this._getBill + '/' + id);
  }

  updateBill(data: any) {
    return this.http.put<any>(this._updateBill, data);
  }

  deleteBill(id) {
    return this.http.delete<any>(this._deleteBill + '/' + id)
  }
  createPaymentRecord(data) {
    return this.http.post<any>(this._createPaymentRecord, data)
  }

}
