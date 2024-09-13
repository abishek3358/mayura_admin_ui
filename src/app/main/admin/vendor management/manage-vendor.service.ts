import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageVendorService {
private _baseUrl = environment.apiUrl + 'api/vendor/';
private _baseUrl1 = environment.apiUrl + 'api/user/';
private _vendorCreate = this._baseUrl1 + 'create/vendor-user';
private _vendorGet = this._baseUrl1 + 'get/vendor_user';
private _vendorStaffGet = this._baseUrl1 + 'getVendorStaff';
private _create = this._baseUrl + 'create';
private _get = this._baseUrl + 'get';
private _getVendor = this._get;
private _update = this._baseUrl + 'update';
private _delete = this._baseUrl + 'delete';
private _contactUpdate = this._baseUrl;
private _contactCreate = this._baseUrl;
private _contactDelete = this._baseUrl;
private _branchUpdate = this._baseUrl;
private _branchCreate = this._baseUrl;
private _branchDelete = this._baseUrl;
private _accountUpdate = this._baseUrl;
  constructor(
    private http:HttpClient
  ) { }

createVendor(data){
    return this.http.post<any>(this._create , data);
  }
getVendor(){
  return this.http.get<any>(this._get);
}
singleVendor(id){
  return this.http.get<any>(this._getVendor + '/' + id);
}
updateVendor(data) {
  return this.http.put<any>(this._update, data);
}
deleteVendor(id) {
  return this.http.delete<any>(this._delete + '/' + id);
}
contactUpdate(data,vendorId){
  return this.http.put<any>( this._contactUpdate +  vendorId + '/' + 'contact_person/update' ,  data);
}
contactCreate(data,vendorId){
  return this.http.post<any>(this._contactCreate + vendorId + '/' + 'contact_person/create',data);
}
contactDelete(id,vendorId){
  return this.http.delete<any>(this._contactDelete + id  + '/' + 'contact_person/delete' +'/' + vendorId);
}
branchUpdate(data,vendorId){
  return this.http.put<any>(this._branchUpdate + vendorId + '/' + 'branch/update', data);
}
branchCreate(data,vendorId){
  return this.http.post<any>(this._branchCreate + vendorId + '/' + 'branch/create',data);
}
branchDelete(id,vendorId){
  return this.http.delete<any>(this._branchDelete + id + '/' + 'branch/delete' + '/' + vendorId);
}
accountUpdate(data,vendorId){
  return this.http.put<any>(this._accountUpdate + vendorId + '/' + 'account/update',data);
}
vendorCreate(data){
return this.http.post<any>(this._vendorCreate,data);
}
vendorGet(){
  return this.http.get<any>(this._vendorGet)
}
}
