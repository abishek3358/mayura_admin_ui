import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GstService {
  private _baseUrl = environment.apiUrl + 'api/gst/';
  private _createGst = this._baseUrl + 'create';
  private _getGst = this._baseUrl + 'get';
  private _updateGst = this._baseUrl + 'update';

  constructor(
    private http: HttpClient
  ) { }

  getGst() {
    return this.http.get<any>(this._getGst);
  }

  getSingleGst(id) {
    return this.http.get<any>(this._getGst + '/' + id);
  }

  createGst(data: any) {
    return this.http.post<any>(this._createGst, data);
  }

  updateGst(data: any) {
    return this.http.put<any>(this._updateGst, data);
  }
}




