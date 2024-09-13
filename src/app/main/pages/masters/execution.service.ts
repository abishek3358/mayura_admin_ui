import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private baseUrl = environment.apiUrl + 'api/execution/';
  private executionCreate = this.baseUrl + 'create';
  private executionGet = this.baseUrl + 'get';
  private executionUpdate = this.baseUrl + 'update';
  private executionDelete = this.baseUrl + 'delete/';
  constructor(
    private http: HttpClient
  ) { }
  _executionCreate(data){
    return this.http.post<any>(this.executionCreate,data);
  }
  _executionGet(){
    return this.http.get<any>(this.executionGet);

  }
  _executionSingleGet(id){
    return this.http.get<any>(this.executionGet + '/' + id);

  }
  _executionUpdate (data){
    return this.http.put<any>(this.executionUpdate,data);
  }
  _deleteExecution(id){
    return this.http.delete<any>(this.executionDelete + id);
  }
}
