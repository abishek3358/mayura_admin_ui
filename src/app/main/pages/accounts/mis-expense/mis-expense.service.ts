import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MisExpenseService {
  private _baseUrl = environment.apiUrl + 'api/expense/';
  private _createMisExpense = this._baseUrl + 'create';
  private _getMisExpense = this._baseUrl + 'get';
  private _updateMisExpense = this._baseUrl + 'update';
  private _deleteMisExpense = this._baseUrl + 'delete';

  constructor(private http: HttpClient) { }
  getMisExpense() {
    return this.http.get<any>(this._getMisExpense);
  }

  getSingleMisExpense(id) {
    return this.http.get<any>(this._getMisExpense + '/' + id );
  }
  getDoubleMisExpense(projectId,categoryId) {
    return this.http.get<any>(this._getMisExpense + '/' + projectId + '/' + categoryId );
  }

  createMisExpense(data) {
    return this.http.post<any>(this._createMisExpense, data);
  }

  updateMisExpense(data) {
    return this.http.put<any>(this._updateMisExpense, data);
  }

  deleteData(id) {
    return this.http.delete(this._deleteMisExpense + '/' + id);
    }
}
