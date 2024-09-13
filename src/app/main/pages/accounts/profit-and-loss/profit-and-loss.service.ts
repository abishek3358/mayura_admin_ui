import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProfitAndLossService {
private _baseUrl = environment.apiUrl + 'api/profit/and/loss/get';
  constructor(
    private http:HttpClient
  ) { }
  profitAndLoss(data){
    return this.http.put<any>(this._baseUrl,data);
  }
 
}
