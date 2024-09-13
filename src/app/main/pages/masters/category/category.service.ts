import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  _baseUrl = environment.apiUrl + 'api/category/'

  private _createCategory = this._baseUrl + 'create';
  private _getCategory = this._baseUrl + 'get';
  private _updateCategory = this._baseUrl + 'update';
  private _deleteCategory = this._baseUrl + 'delete';

  constructor(private http:HttpClient) { }

  createCategory(data:any) {
    return this.http.post<any>(this._createCategory, data);
  }

  getCategory() {
    return this.http.get<any>(this._getCategory);
  }
  
  singleCategory(id) {
    return this.http.get<any>(this._getCategory + '/' + id);
  }

  updateCategory(data){
    return this.http.put<any>(this._updateCategory, data);
  }

  deleteCategory(id) {
    return this.http.delete<any>(this._deleteCategory + '/' + id);
  }
}
