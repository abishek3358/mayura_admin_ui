import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubContractorBillService {
  private baseUrl = environment.apiUrl + 'api/sub/contractor/bill/';
  private create = this.baseUrl + 'create';
  private getAll = this.baseUrl + 'get';
  private SCBillUpdate = this.baseUrl + 'update';
  private ScBillDelete = this.baseUrl + 'delete';
  private SCGetServiceDescription = this.getAll + '/work/order/item/advance';
  private SCGetDetails = this.baseUrl + 'execution/get/';
  private upload = this.create + '/file/upload';
  private payment = this.baseUrl + 'record/payment/create'
  private subContractor = this.baseUrl + 'get/view';
  private freezeContractorBill = this.baseUrl + 'get/freezed/';
  private workOrder = this.baseUrl + 'get/work/order/item/advance';
  private executionGet = this.baseUrl + 'execution/get';
  constructor(
    private http: HttpClient
  ) { }
  scCreate(data) {
    return this.http.post<any>(this.create, data);
  }
  scGet() {
    return this.http.get<any>(this.getAll);
  }
  scSingleGet(id) {
    return this.http.get<any>(this.getAll + '/' + id);
  }
  scUpdate(data) {
    return this.http.put<any>(this.SCBillUpdate, data);
  }
  scBillDelete(id) {
    return this.http.delete<any>(this.ScBillDelete + '/' + id);
  }
  getServiceDescription(data) {
    return this.http.put<any>(this.SCGetServiceDescription, data);
  }
  getDetails(projectId, contractorId, executionId,) {
    return this.http.get<any>(this.SCGetDetails + projectId + '/' + contractorId + '/' + executionId,);
  }
  Upload(data) {
    return this.http.post<any>(this.upload, data);

  }
  subContractorView(id) {
    return this.http.get<any>(this.subContractor + '/' + id);
  }
  paymentCreate(data) {
    return this.http.post<any>(this.payment, data)
  }
  freezeSCBill(id) {
    return this.http.get<any>(this.freezeContractorBill + id);
  }
  getWorkOrder(data) {
    return this.http.put<any>(this.workOrder, data);
  }
  execution(projectId, subContractorId, executionId, subContractorBoqCode) {
    return this.http.get<any>(this.executionGet + projectId + '/' + subContractorId + '/' + executionId + '/' + subContractorBoqCode)
  }
}
