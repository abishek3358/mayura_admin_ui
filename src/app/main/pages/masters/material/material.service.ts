import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private _baseUrl = environment.apiUrl + 'api/material/';
  private _getMaterial = this._baseUrl + 'get';
  private _createMaterial = this._baseUrl + 'create';
  private _updateMaterial = this._baseUrl + 'update';
  private _deleteMaterial = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }
getMaterial(){
  return this.http.get<any>(this._getMaterial);
}
createMaterial(data){
  return this.http.post<any>( this._createMaterial, data);
}
updateMaterial(data){
  return this.http.put<any>(this._updateMaterial, data);
}
deleteMaterial(id){
  return this.http.delete<any>(this._deleteMaterial + '/' + id);
}

}
