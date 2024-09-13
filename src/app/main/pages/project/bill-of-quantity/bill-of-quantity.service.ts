import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillOfQuantityService {
  private _baseUrl = environment.apiUrl + 'api/bill/of/quantity/';
  private _createBoq = this._baseUrl + 'create';
  private _getBoq = this._baseUrl + 'get';
  private _updateBoq = this._baseUrl + 'update';
  private _deleteBoq = this._baseUrl + 'delete';
  private _upload = this._baseUrl + 'file/upload';
   private _viewBoq = environment.apiUrl + 'api/document/download/get';
   private _freezeBoq = this._baseUrl + 'get/freezed/';
   private _getBoqProject = this._baseUrl + 'get/boq/project'
  constructor(
    private http: HttpClient
  ) { }
  createBoq(data) {
    return this.http.post<any>(this._createBoq, data);
  }
  getBoq() {
    return this.http.get<any>(this._getBoq);
  }
  getSingleBoq(id) {
    return this.http.get<any>(this._getBoq + '/' + id);
  }
  updateBoq(data) {
    return this.http.put<any>(this._updateBoq, data);
  }
  deleteBoq(id) {
    return this.http.delete<any>(this._deleteBoq + '/' + id);
  }
  upload(data){
    return this.http.post<any>(this._upload,data);
  }
  viewBoq(billofquantityId ){
    return this.http.get<any>(this._viewBoq + '/' + billofquantityId );
  }
  downloadBoq(billofquantityId){
    return this.http.get<any>(this._viewBoq + '/' + billofquantityId );
  }
  freezeBoq(id){
    return this.http.get<any>(this._freezeBoq + id);
  }
  getBoqProject(){
  return this.http.get<any>(this._getBoqProject)
}
}
