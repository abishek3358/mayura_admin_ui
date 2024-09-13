import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
@Injectable()
export class DashboardService {
  // Public
  public apiData: any;
  public onApiDataChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  private _baseUrl = environment.apiUrl + 'api/dashboard/';
  private _getCount = this._baseUrl + 'counts/get';
  private _getProfitAndLoss = this._baseUrl + 'monthly/profit/and/loss/report';
  private _employeeAttendance = this._baseUrl + 'present/employee/get';
  private _getprojects = this._baseUrl + 'completed/status/get';
  private _getPurchaseOrder = this._baseUrl + 'purchase/component';
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onApiDataChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  getCounts(){
    return this._httpClient.get<any>(this._getCount);
  }
  getProfitAndLoss(calenderType){
 return this._httpClient.get<any>(this._getProfitAndLoss + '/' + calenderType);
  }
  getEmployeeAttendance(){
    return this._httpClient.get<any>(this._employeeAttendance);
  }
  getProjects(){
    return this._httpClient.get<any>(this._getprojects);
  }
  getPurchaseOrder(){
    return this._httpClient.get<any>(this._getPurchaseOrder);
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Api Data
   */
  getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/dashboard-data').subscribe((response: any) => {
        this.apiData = response;
        this.onApiDataChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }

}
