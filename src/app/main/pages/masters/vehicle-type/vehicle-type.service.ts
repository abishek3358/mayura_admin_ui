import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  private _baseUrl = environment.apiUrl + 'api/vehicle/type/';
  private _createVehicle = this._baseUrl + 'create';
  private _getVehicle = this._baseUrl + 'get';
  private _updateVehicle = this._baseUrl + 'update';
  private _deleteVehicle = this._baseUrl + 'delete';
  constructor(
    private http: HttpClient
  ) { }
  createVehicle(data) {
    return this.http.post<any>(this._createVehicle, data);
  }
  getVehicle() {
    return this.http.get<any>(this._getVehicle);
  }
  updateVehicle(data){
    return this.http.put<any>(this._updateVehicle,data);
  }
  deleteVehicle(id){
    return this.http.delete<any>(this._deleteVehicle + '/' + id);
  }

}
