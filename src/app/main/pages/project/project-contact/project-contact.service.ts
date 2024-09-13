import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectContactService {
  private _baseUrl = environment.apiUrl + 'api/project/contacts/'
  private _getproject = this._baseUrl + 'get'
  private _createproject = this._baseUrl + 'create'
  private _updateProject = this._baseUrl + 'update'
  private _deleteproject = this._baseUrl + 'delete'

  constructor(
    private http: HttpClient

  ) { }

  getProject() {
    return this.http.get<any>(this._getproject);
  }
  createProject(data){
    return this.http.post<any>(this._createproject, data);

  }
  getSingleProject(id) {
    return this.http.get<any>(this._getproject + '/' + id);
  }
  updateProject(data) {
    return this.http.put<any>(this._updateProject, data);
  }
  deleteProject(projectContactsId) {
    return this.http.delete<any>(this._deleteproject + '/' + projectContactsId);
  }
}
