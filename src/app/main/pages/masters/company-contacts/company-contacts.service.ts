import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyContactsService {
  _baseUrl = environment.apiUrl + 'api/company/contacts/'

  private _createCmpcontacts = this._baseUrl + 'create';
  private _getCmpcontacts = this._baseUrl + 'get';
  private _updateCmpcontacts = this._baseUrl + 'update';
  private _deleteCmpcontacts = this._baseUrl + 'delete';

  constructor(private http:HttpClient) { }

  createCmpcontacts(data:any) {
    return this.http.post<any>(this._createCmpcontacts, data);
  }

  getCmpcontacts() {
    return this.http.get<any>(this._getCmpcontacts);
  }
  
  singleEmp(id) {
    return this.http.get<any>(this._getCmpcontacts + '/' + id);
  }

  updateCmpcontacts(data){
    return this.http.put<any>(this._updateCmpcontacts, data);
  }

  deleteCmpcontacts(id) {
    return this.http.delete<any>(this._deleteCmpcontacts + '/' + id);
  }

}
