import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlantMachinaryService {

  private _baseUrl = environment.apiUrl + 'api/plant/and/machinery/';
  private _create = this._baseUrl + 'create';
  private _get = this._baseUrl + 'get';
  private _update = this._baseUrl + 'update';
  private _delete = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }
  getPlantMachinery() {
    return this.http.get<any>(this._get);
  }

  getSinglePlantMachinery(id) {
    return this.http.get<any>(this._get + '/' + id );
  }

  createPlantMachinery(data) {
    return this.http.post<any>(this._create, data);
  }

  updatePlantMachinery(data) {
    return this.http.put<any>(this._update, data);
  }

  deleteDataPlantMachinery(id) {
    return this.http.delete(this._delete + '/' + id);
    }
}
