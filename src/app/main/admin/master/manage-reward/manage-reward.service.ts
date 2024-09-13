import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRewardService {
 private _baseurl = environment.apiUrl +'api/manage/rewards/';
 private _getreward = this._baseurl +'get'
  constructor(
   private http:HttpClient,
  ) { }
getReward(){
 return this.http.get<any>(this._getreward)
}

}
