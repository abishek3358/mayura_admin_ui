import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubContractorBoqService {
  private _baseUrl = environment.apiUrl + 'api/sub/contractor/boq/';
  private _createSCBoq = this._baseUrl + 'create';
  private _getSacBoq = this._baseUrl + 'execution/item/get/';
  private _getServiceDescription = this._baseUrl + 'workorder/details/get/';
  private _getExcutionDescription = this._baseUrl + 'execution/get/';
  private _deleteSCBoq = this._baseUrl + 'delete/';
  private _updateSCBoq = this._baseUrl + 'update';
  private _getBoq = this._baseUrl + 'get';
  private _getExecutionValue = this._baseUrl + 'execution/get/';
  private _FreezeScBoq = this._baseUrl + 'get/freezed';
  private _uplod = this._baseUrl + 'file/upload';
  constructor(private http: HttpClient) { }

  createSCBoq(data) {
    return this.http.post<any>(this._createSCBoq, data);
  }
  getBoq() {
    return this.http.get<any>(this._getBoq)
  }
  getSacBoq(id) {
    return this.http.get<any>(this._getSacBoq + id);
  }
  getServiceDescription(id) {
    return this.http.get<any>(this._getServiceDescription + id);
  }
  getExcutionDescription(id) {
    return this.http.get<any>(this._getExcutionDescription + id);
  }
  deleteSCBoq(id) {
    return this.http.delete<any>(this._deleteSCBoq + id);
  }
  getSingleSCBoq(id) {
    return this.http.get<any>(this._getBoq + '/' + id);
  }
  updateSCBoq(data) {
    return this.http.put<any>(this._updateSCBoq, data);
  }
  getDescription(executionId,projectId) {
    return this.http.get<any>(this._getExecutionValue + executionId + '/' + projectId)
  }
  freezeScBoq(id){
    return this.http.get<any>(this._FreezeScBoq  + '/' + id);

  }
  upload(data){
    return this.http.post<any>(this._uplod,data);
  }
}
