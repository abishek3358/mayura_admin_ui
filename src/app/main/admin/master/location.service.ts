import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _baseUrl = environment.apiUrl + 'api/'

  private _getCountry = this._baseUrl + 'country/get'

  private _getState = this._baseUrl + 'country/state/get'

  private _createCity = this._baseUrl + 'city/create'

  private _getCity = this._baseUrl + 'country/city/get'

  private _getSingleCity = this._baseUrl + 'city/get'

  private _updateCity = this._baseUrl + 'city/update'

  private _deleteCity = this._baseUrl + 'city/delete'

  constructor(
    private http: HttpClient

  ) { }
  getCountry() {
    return this.http.get<any>(this._getCountry);
  }
  getState(id) {
    return this.http.get<any>(this._getState + '/' + id);
  }
  getAllCity(){
    return this.http.get<any>(this._getSingleCity);
  }
  getSingleCity(id){
    return this.http.get<any>(this._getSingleCity+ '/' + id);
  }
  getCity(id) {
    return this.http.get<any>(this._getCity+ '/' + id);
  }

  createCity(data) {
    return this.http.post<any>(this._createCity, data);
  }
  updateCity(data) {
    return this.http.put<any>(this._updateCity, data);
  }
  deleteCity(id) {
    return this.http.delete<any>(this._deleteCity + '/' + id);
  }
}
