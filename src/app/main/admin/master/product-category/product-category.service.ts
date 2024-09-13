import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private _baseurl = environment.apiUrl + 'api/product/category/'
  private _createproduct = this._baseurl + 'create'
  private _getproduct = this._baseurl + 'get'
  private _updateproduct = this._baseurl + 'update'

  constructor( private http: HttpClient
  ) { }
  createProductCategory(data:any) {
    return this.http.post<any>(this._createproduct, data);
  }
  getProductCategory() {
    return this.http.get<any>(this._getproduct);
  }
  singleProductCategory(productCategoryId:any) {
    return this.http.get<any>(this._getproduct + '/'+ productCategoryId);
  }
  updateProductCategory(data:any) {
    return this.http.put<any>(this._updateproduct, data);
  }
}
