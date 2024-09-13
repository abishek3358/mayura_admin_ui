import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  _baseUrl = environment.apiUrl + 'api/employee/'

  private _createEmp = this._baseUrl + 'create';
  private _empGet = this._baseUrl + 'get';
  private _updateEmp = this._baseUrl + 'update';
  private _deleteEmp = this._baseUrl + 'delete';
  private _upload = this._baseUrl + 'file/upload';

  // private _empId = new Subject<string>();
  // empId$ = this._empId.asObservable();
  private _attendanceGet = this._empGet + '/employee'


  constructor(private http:HttpClient) { }

  createEmp(data:any) {
    return this.http.post<any>(this._createEmp, data);
  }

  attendanceDetails (id){
    return this.http.get<any>(this._attendanceGet + '/' + id);
  }

  getEmp() {
    return this.http.get<any>(this._empGet );
  }

  singleEmp(id) {
    return this.http.get<any>(this._empGet + '/' + id);
  }
  
  updateEmp(data) {
    return this.http.put<any>(this._updateEmp, data);
  }

  deleteEmp(id) {
    return this.http.delete<any>(this._deleteEmp + '/' + id);
  }
  upload(data){
    return this.http.post<any>(this._upload,data);
  }

  // empId(employee: string) {
  //   this._empId.next(employee);
  // }

}
