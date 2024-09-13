import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
private _baseUrl=environment.apiUrl+'api/';
//uom api 
private _createUom=this._baseUrl+'uom/create';
private _getUom=this._baseUrl+'uom/get';

private _updateUom=this._baseUrl+'uom/update';
private _deleteUom = this._baseUrl + 'uom/delete';


  constructor(private http:HttpClient) { }
  //uom method
  createuommethod(data:any){
    return this.http.post<any>(this._createUom,data);
  
  }
  getuommethod(){
    return this.http.get<any>(this._getUom);
  }
  updateuommethod(data:any){
return this.http.put<any>(this._updateUom,data);
  }
  deleteuommethod(id) {
    return this.http.delete<any>(this._deleteUom + '/' + id);
  }
}
