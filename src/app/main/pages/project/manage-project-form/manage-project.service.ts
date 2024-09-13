import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ManageProjectService {
  private _baseUrl = environment.apiUrl + 'api/project/'
  private _createProject = this._baseUrl + 'create';
  private _getProject = this._baseUrl + 'get';
  private _getItem = this._getProject + '/item';
  private _updateProject = this._baseUrl + 'update';
  private _deleteProject = this._baseUrl + 'delete';
  private _getboq = this._baseUrl + 'get/all'
  private _upload = this._createProject + '/file/upload';
  private _report = this._baseUrl + 'project/report';
  private _getStatus =  this._baseUrl + 'completed';
  constructor(
    private http: HttpClient
  ) { }
  createProject(data) {
    return this.http.post<any>(this._createProject, data);
  }
  getProject() {
    return this.http.get<any>(this._getProject);
  }
  getSingleProject(id) {
    return this.http.get<any>(this._getProject + '/' + id);
  }
  getItem() {
    return this.http.get<any>(this._getItem);
  }
  updateProject(data) {
    return this.http.put<any>(this._updateProject, data);
  }
  delectProject(id) {
    return this.http.delete<any>(this._deleteProject + '/' + id);
  }
  getBOQ(id) {
    return this.http.get<any>(this._getboq + '/' + id);
  }
  getProjectId(projectId) {
    return this.http.get<any>(this._getboq + '/' + projectId);
  }
  upload(data) {
    return this.http.post<any>(this._upload, data);
  }
  projectReport(data) {
    return this.http.put<any>(this._report, data)
  }
  
  getStatus(Id){
    return this.http.get<any>(this._getStatus + '/' + Id)
  }
  
}
