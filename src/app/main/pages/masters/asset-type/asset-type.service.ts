import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssettypeService {
private baseUrl = environment.apiUrl + 'api/asset/type';
private assetTypeGet = this.baseUrl + '/get';
private assetTypeCreate = this.baseUrl + '/create';
private assetTypeUpdate = this.baseUrl + '/update';
private assetTypeDelete = this.baseUrl + '/delete';

  constructor(private http: HttpClient) { }
  getAssetType() {
    return this.http.get<any>(this.assetTypeGet);
  }
  createAssetType(data) {
    return this.http.post<any>(this.assetTypeCreate, data);
  }
  updateAssetType(data) {
    return this.http.put<any>(this.assetTypeUpdate, data);
  }
  deleteAssetType(id) {
    return this.http.delete<any>(this.assetTypeDelete + '/' + id);
  }
}
