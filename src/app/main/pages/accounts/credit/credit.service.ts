import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CreditService {

  _baseUrl = environment.apiUrl + 'api/credit/note/'

  private _createCredit = this._baseUrl + 'create';
  private _getCredit = this._baseUrl + 'get';
  private _updateCredit = this._baseUrl + 'update';
  private _deleteCredit = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }

  createCredit(data: any) {
    return this.http.post<any>(this._createCredit, data);
  }
  getCredit() {
    return this.http.get<any>(this._getCredit);
  }
  singleCredit(id) {
    return this.http.get<any>(this._getCredit + '/' + id);
  }

  updateCredit(data) {
    return this.http.put<any>(this._updateCredit, data);
  }
  deleteCredit(id) {
    return this.http.delete<any>(this._deleteCredit + '/' + id);
  }

}
