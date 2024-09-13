import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private _baseUrl = environment.apiUrl + 'api/work/order/'
  private _getWorkOrder = this._baseUrl + 'get'
  private _createWorkOrder = this._baseUrl + 'create'
  private _updateWorkOrder = this._baseUrl + 'update'
  private _deleteWorkOrder = this._baseUrl + 'delete'

  constructor(
    private http: HttpClient

  ) { }
  getWorkOrderList() {
    return this.http.get<any>(this._getWorkOrder);
  }
}
