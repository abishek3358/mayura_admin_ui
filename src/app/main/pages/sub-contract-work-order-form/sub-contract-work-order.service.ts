import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubContractWorkOrderService {
  private _baseUrl = environment.apiUrl + 'api/sub/contractor/work/order/'
  private _getcontract = this._baseUrl + 'get'
  private _createcontract = this._baseUrl + 'create'
  private _updatecontract = this._baseUrl + 'update'
  private _deletecontract = this._baseUrl + 'delete'
  private _getItem = environment.apiUrl + '/api/project/get/all/'
  private _view = this._baseUrl + 'view';
  
  constructor(
    private http: HttpClient

  ) { }

  getSubContract() {
    return this.http.get<any>(this._getcontract);
  }
  createSubContract(data) {
    return this.http.post<any>(this._createcontract, data);

  }
  getSingleSubContract(id) {
    return this.http.get<any>(this._getcontract + '/' + id);
  }

  updateSubContract(data) {
    return this.http.put<any>(this._updatecontract, data);
  }
  deleteSubContract(id) {
    return this.http.delete<any>(this._deletecontract + '/' + id);
  }
  getItem(projectId) {
    return this.http.get<any>(this._getItem + '/' + projectId);
  }
  subContractorView(id) {
    return this.http.get<any>(this._view + '/' + id);
  }
 
}
