import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private _baseUrl = environment.apiUrl + 'api/voucher/'
  private _getvoucher = this._baseUrl + 'get'
  private _createvoucher = this._baseUrl + 'create'
  private _updatevoucher = this._baseUrl + 'update'
  private _deletevoucher = this._baseUrl + 'delete'

  constructor(
    private http: HttpClient

  ) { }


  createVoucher(data) {
    return this.http.post<any>(this._createvoucher, data);

  }

  getVoucher() {
    return this.http.get<any>(this._getvoucher);
  }

  updateVoucher(data) {
    return this.http.put<any>(this._updatevoucher, data);
  }
  getSingleVoucher(id) {
    return this.http.get<any>(this._getvoucher + '/' + id);
  }
  deleteVoucher(id) {
    return this.http.delete<any>(this._deletevoucher + '/' + id);
  }

}
