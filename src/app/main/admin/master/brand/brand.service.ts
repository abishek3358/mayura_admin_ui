import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private _baseUrl = environment.apiUrl + 'api/brand/';
  private _createBrand = this._baseUrl + 'create';
  private _getBrand = this._baseUrl + 'get';
  private _updateBrand = this._baseUrl + 'update';
  private _deleteBrand = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }
  createBrand(data: any) {
    return this.http.post<any>(this._createBrand, data);
  }
  getBrand() {
    return this.http.get<any>(this._getBrand);
  }
  singleGetBrand(id: any) {
    return this.http.get<any>(this._getBrand + '/' + id);
  }
  updateBrand(data) {
    return this.http.put<any>(this._updateBrand, data);
  }
  deleteBrand(id: any) {
    return this.http.delete<any>(this._deleteBrand + '/' + id);
  }
}


