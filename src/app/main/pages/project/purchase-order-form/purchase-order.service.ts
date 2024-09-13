import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
private _baseUrl = environment.apiUrl + 'api/purchase/order/';
private _createPurcase = this._baseUrl + 'create';
private _getPurchase = this._baseUrl + 'get';
private _updatePurchase = this._baseUrl + 'update';
private _deletePurchase = this._baseUrl + 'delete';
private _upload = this._createPurcase + '/file/upload';
private _view = this._baseUrl + 'view';
private getMetterial = this._baseUrl + 'material/get/';
private getSupplyDetails = this._baseUrl + 'supply/get/';
private CreatePayment = this._baseUrl + 'record/payment/create';
private freezePurchase = this._baseUrl + 'get/freezed/'
  constructor(
    private http:HttpClient
  ) { }
  createPurchase(data){
   return this.http.post<any>(this._createPurcase,data);
  }
  getPurchase(){
   return this.http.get<any>(this._getPurchase);
  }
  getSingleProject(id){
    return this.http.get<any>(this._getPurchase + '/' + id);
  }
  updatePurchase(data){
   return this.http.put<any>(this._updatePurchase,data);
  }
  deletePurchase(id){
    return this.http.delete<any>(this._deletePurchase + '/' + id);
  }
  upload(data){
    return this.http.post<any>(this._upload,data);
  }
  view(id){
    return this.http.get<any>(this._view + '/'+ id);
  }
  metterialGet(id){
    return this.http.get<any>(this.getMetterial + id);
  }
  supplyGet(matId,projectId) {
    return this.http.get<any>(this.getSupplyDetails + matId + '/' + projectId);
  }
 createPayment(data){
   return this.http.post<any>(this.CreatePayment,data);
 }
 freezePo(id){
  return this.http.get<any>(this.freezePurchase + id);
}
}
