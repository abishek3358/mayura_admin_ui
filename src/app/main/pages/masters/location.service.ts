import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _baseUrl = environment.apiUrl + 'api/'
  private _creatteCity = this._baseUrl + 'product/category/create'
  private _gettCity = this._baseUrl + 'product/category/get'
  // CITY API'S
  private _createCity = this._baseUrl + 'city/create'
  private _getCity = this._baseUrl + 'city/get'
  private _updateCity = this._baseUrl + 'city/update'
  private _deleteCity = this._baseUrl + 'city/delete'

  // STATE API'S
  private _createState = this._baseUrl + 'state/create'
  private _getState = this._baseUrl + 'state/get'
  private _updateState = this._baseUrl + 'state/update'
  private _deleteState = this._baseUrl + 'state/delete'

  // COUNTRY API'S
  private _createCountry = this._baseUrl + 'country/create'
  private _getCountry = this._baseUrl + 'country/get'
  private _updateCountry = this._baseUrl + 'country/update'
  private _deleteCountry = this._baseUrl + 'country/delete'

  constructor(
    private http: HttpClient
  ) { }

  //CITY METHODS
  createCity(data) {
    return this.http.post<any>(this._createCity, data);
  }
  getCity() {
    return this.http.get<any>(this._getCity);
  }
  singleCity(stateId){
    return this.http.get<any>(this._getCity + '/' + stateId);
  }
  updateCity(data) {
    return this.http.put<any>(this._updateCity, data);
  }
  deleteCity(id) {
    return this.http.delete<any>(this._deleteCity + '/' + id);
  }

  //STATE METHODS
  createState(data) {
    return this.http.post<any>(this._createState, data);
  }
  getState() {
    return this.http.get<any>(this._getState);
  }
  singleState(id) {
    return this.http.get<any>(this._getState + '/' + id);
  }
  updateState(data) {
    return this.http.put<any>(this._updateState, data);
  }
  deleteState(id) {
    return this.http.delete<any>(this._deleteState + '/' + id);
  }

  //COUNTRY METHODS
  createCountry(data) {
    return this.http.post<any>(this._createCountry, data);
  }
  getCountry() {
    return this.http.get<any>(this._getCountry);
  }
  updateCountry(data) {
    return this.http.put<any>(this._updateCountry, data);
  }
  deleteCountry(id) {
    return this.http.delete<any>(this._deleteCountry + '/' + id);
  }
  creatteCity(data) {
    return this.http.post<any>(this._creatteCity, data);
  }
  gettCity() {
    return this.http.get<any>(this._gettCity);
  }
}
