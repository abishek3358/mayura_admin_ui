import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private _baseUrl = environment.apiUrl + 'api/contractor/';
  private _createContractor = this._baseUrl + 'create';
  private _getContractor = this._baseUrl + 'get';
  private _updateContractor = this._baseUrl + 'update';
  private _deleteContractor = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }

  createContractor(data) {
    return this.http.post<any>(this._createContractor, data);
  }

  getContractor() {
    return this.http.get<any>(this._getContractor);
  }

  singleContractor(id) {
    return this.http.get<any>(this._getContractor + '/' + id);
  }

  updateContractor(data) {
    return this.http.put<any>(this._updateContractor, data);
  }
  deleteContractor(id) {
    return this.http.delete<any>(this._deleteContractor + '/' + id);
  }



}
