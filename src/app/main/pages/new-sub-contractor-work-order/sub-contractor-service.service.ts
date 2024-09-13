import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SubContractorServiceService {
  private _baseUrl = environment.apiUrl + 'api/sub/contractor/work/order/';
  private _createWO = this._baseUrl + 'create';
  private _getWo = this._baseUrl + 'get';
  private _updateWo = this._baseUrl + 'update';
  private _viewWo = this._baseUrl + 'view';
  private _deleteWo = this._baseUrl + 'delete';
  private _getStatus = this._baseUrl + 'completed'
  private _scBoqCode = this._baseUrl + 'get/sub/contractor/boq/code';
    constructor(
      private http: HttpClient
    ) { }
    createWO(data){
      return this.http.post<any>(this._createWO,data);
    }
    getWo(){
      return this.http.get<any>(this._getWo);
    }
    getSingleWo(id){
      return this.http.get<any>(this._getWo + '/' + id);
    }
    getWoDetail(projectId,contractorId,subContractorBoqCode){
      return this.http.get<any>(this._getWo + '/' + projectId + '/' + contractorId + '/' + subContractorBoqCode);
    }
    updateWO(data){
      return this.http.put<any>(this._updateWo,data);
    }
    viewWo(id){
      return this.http.get<any>(this._viewWo + '/' + id);
    }
    deleteWo(id){
      return this.http.delete<any>(this._deleteWo + '/' + id);
    }
    getStatus(workOrderId){
      return this.http.get<any>(this._getStatus + '/' + workOrderId);
    }
    getSubContractorBoqCode(projectId,contractorId){
      return this.http.get<any>(this._scBoqCode + '/' + projectId + '/' + contractorId)
    }
}
