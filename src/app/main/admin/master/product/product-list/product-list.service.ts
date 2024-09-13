import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProductListService {
  _baseUrl = environment.apiUrl + 'api/product/'
  private _createProduct = this._baseUrl + 'create';
  private _getProduct = this._baseUrl + 'get';
  private _updateProduct = this._baseUrl + 'update';
  private _deleteProduct = this._baseUrl + 'delete';
  private _uomDelete = this._baseUrl + 'uomdelete';
  private _imageDelete = this._baseUrl + 'imagedelete';
  

  constructor(private http:HttpClient) { }
  createProduct(data) {
    return this.http.post<any>(this._createProduct, data);
  }
  getProduct() {
    return this.http.get<any>(this._getProduct);
  }
  singleProduct(id){
 
    return this.http.get<any>(this._getProduct + '/' + id);
  }
  updateProduct(data) {
    return this.http.put<any>(this._updateProduct, data);
  }
  deleteProduct(id) {
    return this.http.delete<any>(this._deleteProduct + '/' + id);
  }
  deleteUom(id) {
    return this.http.delete<any>(this._uomDelete + '/' + id);
  }
  deleteImage(id) {
    return this.http.delete<any>(this._imageDelete + '/' + id);
  }
}
