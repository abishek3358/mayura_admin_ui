import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DebitserviceService {
  private _baseUrl = environment.apiUrl + 'api/debit/note/';
  private _createDebit = this._baseUrl + 'create';
  private _getDebit = this._baseUrl + 'get';
  private _updateDebit = this._baseUrl + 'update';
  private _deleteDebit = this._baseUrl + 'delete';
  constructor(private http: HttpClient) { }
  createDebit(data) {
    return this.http.post<any>(this._createDebit, data);
  }
  getDebit() {
    return this.http.get<any>(this._getDebit);
  }
  updateDebit(data) {
    return this.http.put<any>(this._updateDebit, data);
  }
  deleteDebit(id) {
    return this.http.delete<any>(this._deleteDebit + '/' + id);
  }
  singleGetDebit(id) {
    return this.http.get<any>(this._getDebit + '/' + id);
  }
}
