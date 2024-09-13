import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  _baseUrl = environment.apiUrl + 'api/advance';
  private _getAdvance = this._baseUrl + '/get';
  private _createAdvance = this._baseUrl + '/create';
  private _updateAdvance = this._baseUrl + '/update';
  private _deleteAdvance = this._baseUrl + '/delete';

  constructor(private http: HttpClient) { }
  createAdvance(data) {
    return this.http.post<any>(this._createAdvance, data);
  }
  getAdvance() {
    return this.http.get<any>(this._getAdvance);
  }
  updateAdvance(id) {
    return this.http.put<any>(this._updateAdvance, id);
  }
  deleteAdvance(id) {
    return this.http.delete<any>(this._deleteAdvance + '/' + id);
  }
  getSingleAdvance(id){
    return this.http.get<any>(this._getAdvance + '/' + id);
  }
}
