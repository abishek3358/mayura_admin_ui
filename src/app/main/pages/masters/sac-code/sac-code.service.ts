import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SacCodeService {
  private _baseUrl = environment.apiUrl + 'api/sac/code/';
  private _createsacCode = this._baseUrl + 'create';
  private _getsacCode = this._baseUrl + 'get';
  private _updatesacCode = this._baseUrl + 'update';
  private _deletesacCode = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }
  getSacCode() {
    return this.http.get<any>(this._getsacCode);
  }

  getSingleSacCode(id) {
    return this.http.get<any>(this._getsacCode + '/' + id );
  }

  createSacCode(data) {
    return this.http.post<any>(this._createsacCode, data);
  }

  updateSacCode(data) {
    return this.http.put<any>(this._updatesacCode, data);
  }

  deleteData(id) {
    return this.http.delete(this._deletesacCode + '/' + id);
    }
}
