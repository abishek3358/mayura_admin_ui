import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorOrderService {

  private _baseUrl = environment.apiUrl + 'api/vendor/mapping/';
  private _baseUrl2 = environment.apiUrl + 'api/vendor/mapping/information/fetch/';
  private _getAllocate = this._baseUrl + 'orders/status';
 
  private _baseUrl1 = environment.apiUrl + 'api/full-fillment/order/update/';
  private _updateShipped = this._baseUrl1 + 'progress';
  private _updateDelivered = this._baseUrl1 + 'delivered';
  private _orderReject = environment.apiUrl + 'api/vendor/mapping/vendor/reject/orders';

  
  constructor(
    private http:HttpClient,
  ) { }
  getVendor(orderStatus){
    return this.http.get<any>(this._getAllocate + '/' + orderStatus);
  }
  shippedUpdate(data,customerOrderId){
    return this.http.put<any>(this._updateShipped + '/' + customerOrderId,data)
  }
  deliveryUpadate(customerOrderId,data){
    return this.http.put<any>(this._updateDelivered + '/' + customerOrderId,data)
  }
  vendorView(customerOrderId){
    return this.http.get<any>(this._baseUrl2 + '/' + customerOrderId )
  }
  vendorReject(data:any){
    return this.http.put<any>(this._orderReject,data)
  }

}