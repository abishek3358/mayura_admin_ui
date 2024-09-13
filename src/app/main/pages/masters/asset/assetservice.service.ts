import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetserviceService {
  private baseurl = environment.apiUrl + 'api/asset';
  private getAsset = this.baseurl + '/get';
  private createAsset = this.baseurl + '/create';
  private updateAsset = this.baseurl + '/update';
  private deleteAsset = this.baseurl + '/delete';

  constructor(private http: HttpClient) { }
  assetGet() {
   return this.http.get<any>(this.getAsset);
  }
  assetCreate(data) {
    return this.http.post<any>(this.createAsset, data);
  }
  assetDelete(id) {
    return this.http.delete<any>(this.deleteAsset + '/' + id  );
  }
  assetUpdate(data) {
    return this.http.put<any>(this.updateAsset, data );
  }

}


