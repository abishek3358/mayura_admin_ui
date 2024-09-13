import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _baseUrl = environment.apiUrl + 'api/currency/';
  private _currencyCreate = this._baseUrl + 'create';
  private _currencyGet = this._baseUrl + 'get';
  private _currencyUpdate = this._baseUrl + 'update';
  private _currencyDelete = this._baseUrl + 'delete';
  constructor(
    private http: HttpClient
  ) { }

  createCurrency(data) {
    return this.http.post<any>(this._currencyCreate, data);
  }
  getCurrency() {
    return this.http.get<any>(this._currencyGet);
  }
  updateCurrency(data) {
    return this.http.put<any>(this._currencyUpdate, data);
  }
  deleteCurrency(id) {
    return this.http.delete<any>(this._currencyDelete + '/' + id);
  }
}
