import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceService {
  private _baseUrl = environment.apiUrl + 'api/employee/attendance/';
  private _createAttendance = this._baseUrl + 'create';
  private _getAttendanceDetails = this._baseUrl + 'get';
  private _searchDetails = this._baseUrl + 'search';
  private _viewReport = this._getAttendanceDetails + '/' + 'report';
  private _singleAttendanceGet = this._baseUrl + 'getAttendance/';
  private _updateAttendance = this._baseUrl + 'update';
  constructor(
    private http: HttpClient
  ) { }
  createAttendance(data) {
    return this.http.post<any>(this._createAttendance, data);
  }
  getDetails(id) {
    return this.http.get<any>(this._getAttendanceDetails + '/' + id);
  }
  viewDetails(projectId, month) {
    return this.http.get<any>(this._viewReport + '/' + projectId + '/' + month);
  }
  singleAttendanceGet(id){
    return this.http.get<any>(this._singleAttendanceGet  + id);
  }
  searchDetails(data) {
    return this.http.put<any>(this._searchDetails, data);
  }
  updateAttendance(data){
    return this.http.put<any>(this._updateAttendance,data);
  }
}
