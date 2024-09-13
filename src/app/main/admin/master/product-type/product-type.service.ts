import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private _baseUrl = environment.apiUrl + 'api/product/type/';
  private _createProduct = this._baseUrl + 'create';
  private _getProduct = this._baseUrl + 'get';
  private _updateProduct = this._baseUrl + 'update';

  constructor(
    private http:HttpClient,
  ) { }
  createProduct(data) {
    return this.http.post<any>(this._createProduct, data);
  }
  getProduct() {
    return this.http.get<any>(this._getProduct);
  }
  getsingleProduct(productTypeId) {
    return this.http.get<any>(this._getProduct + '/' + productTypeId);
  }
  updateProduct(data) {
    return this.http.put<any>(this._updateProduct, data);
  }
}
