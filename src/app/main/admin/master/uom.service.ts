import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UomService {
  private _baseUrl = environment.apiUrl + 'api/uom/';
  private _createUom = this._baseUrl + 'create';
  private _getUom = this._baseUrl + 'get';
  private _updateUom = this._baseUrl + 'update';

  constructor(  
      private http: HttpClient
    ) { }
    createUom(data:any) {
      return this.http.post<any>(this._createUom, data);
    }
    getUom() {
      return this.http.get<any>(this._getUom);
    }
    singleGetUom(id:any){
      return this.http.get<any>(this._getUom + '/' + id);
    }
    updateUom(data) {
      return this.http.put<any>(this._updateUom, data);
    }

}
