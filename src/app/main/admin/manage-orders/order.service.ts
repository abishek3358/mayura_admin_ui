import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _baseUrl = environment.apiUrl + 'api/full-fillment/';
  private getOrderPending = this._baseUrl + 'confirm/orders';
  private _getOrderPending = this._baseUrl + 'orders';

  private _baseUrl1 = environment.apiUrl ;
  private _getVendor =this._baseUrl1+'api/vendor/mapping/information/fetch';

  private getAllocate = this._baseUrl1 +'api/vendor/mapping/create';
  private getshipped= this._baseUrl1 + 'api/vendor/mapping/orders/status'
  private getClosed= this._baseUrl1 + 'api/full-fillment/order/update/completed'; 
  private getRejectedOrder = this._baseUrl + 'admin/reject/orders';

  constructor(
    private http : HttpClient
  ) { }

  orderPending(status:any,data:any){
    return this.http.put<any>(this._getOrderPending + '/' + status, data);
  }
  pending(status:any,data:any){
    return this.http.put<any>(this.getOrderPending + '/' + status, data);
  }
  getVendor(customerOrderId:any){
    return this.http.get<any>(this._getVendor + '/' + customerOrderId);
  }
  getClose(customerOrderId:any,data){
    return this.http.put<any>(this.getClosed + '/' + customerOrderId,data);
  }

  getAllocated(data: any) {
    return this.http.post<any>(this.getAllocate, data);
  }

  getRejectedOrders(){
    return this.http.get<any>(this.getRejectedOrder);
  }
  adminRejectedOrders(data:any){
    return this.http.put<any>(this.getRejectedOrder,data);
  }
  // getShipped(status: any) {
  //   return this.http.get<any>(this.getshipped + '/' + status);
  // }
  // getdeliverd(status: any) {
  //   return this.http.get<any>(this.getshipped + '/' + status);
  // }


}
