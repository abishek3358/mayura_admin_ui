import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OffersService {
  _baseUrl = environment.apiUrl + 'api/offer/details/'
  private _createOffer = this._baseUrl + 'create';
  private _getOffer = this._baseUrl + 'get';
  private _updateOffer = this._baseUrl + 'update';
  private _deleteOffer = this._baseUrl + 'delete';
  private _getActive = this._getOffer + '/active';
  private _getExpiry = this._getOffer + '/expiry';




  constructor(private http:HttpClient) { }
  createOffer(data:any) {
    return this.http.post<any>(this._createOffer, data);
  }
  getActive() {
    return this.http.get<any>(this._getActive);
  }
  getExpiry() {
    return this.http.get<any>(this._getExpiry);
  }
  singleOffer(id:any){
 
    return this.http.get<any>(this._getOffer + '/' + id);
  }

  updateOffer(data) {
    return this.http.put<any>(this._updateOffer, data);
  }
  deleteOffer(id)
 {
    return this.http.delete<any>(this._deleteOffer + '/' + id);
  }
  

}
