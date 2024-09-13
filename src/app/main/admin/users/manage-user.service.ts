import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {
  private _baseUrl = environment.apiUrl + 'api/user/'
  private _getUser = this._baseUrl + 'get'
  private _createUser = this._baseUrl + 'create'
  private _updateUser = this._baseUrl + 'update'
  private _deleteUser = this._baseUrl + 'delete'

  private _baseUrl1 = environment.apiUrl + 'auth/change/'
  private _changePassword = this._baseUrl1 + 'password'

  //admin profile update

  private _profileUpdate = environment.apiUrl + 'api/user/admin/update';
  private _userEdit = environment.apiUrl + 'api/user/get';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  constructor(
    private http: HttpClient,

  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    this.currentUserSubject.next(currentUser);
   }

  createUser(data: any) {
    return this.http.post<any>(this._createUser, data);
  }
  getUser() {
    return this.http.get<any>(this._getUser);
  }
  updateUser(data) {
    return this.http.put<any>(this._updateUser, data);
  }
  deleteUser(id: any) {
    return this.http.delete<any>(this._deleteUser + '/' + id);
  }
  getSingleUser(userId) {
    return this.http.get<any>(this._getUser + '/' + userId);
  }

  changePassword(data) {
    return this.http.put<any>(this._changePassword, data);
  }

  profileUpdate(data:any){
    return this.http.put<any>(this._profileUpdate,data);
  }
  userEdit(userId){
    return this.http.get<any>(this._userEdit + '/' + userId);
  }
  public updateCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }
}
