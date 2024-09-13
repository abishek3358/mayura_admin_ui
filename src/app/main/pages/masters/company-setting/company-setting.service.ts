import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanySettingService {
  private _baseUrl = environment.apiUrl + 'api/company/';
  private _getcompany = this._baseUrl + 'get';
  private _updatecompany = this._baseUrl + 'update';

  constructor(private http: HttpClient) { }
  getcompany() {
    return this.http.get<any>(this._getcompany);
  }
  updatecompany(data) {
    return this.http.put<any>(this._updatecompany, data);
  }

}
