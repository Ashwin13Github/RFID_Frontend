import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

//
// 🔹 MODEL SECTION
//
export interface AssetTheftAlert {
  alertId: number;
  assetId: number;
  readerId: string;
  alertMessage: string;
  alertTime: string;
  status: string;
  assetName: string;
}

export interface UpdateStatusRequest {
  alertId: number;
  newStatus: string;
  comments?: string;
}

//
// 🔹 SERVICE SECTION
//
@Injectable({
  providedIn: 'root'
})
export class AssetTheftService {

  private baseUrl = 'https://localhost:44372/api/AssetTheft';

  constructor(private http: HttpClient) {}

  // GET: Theft Alerts
  getAlerts(): Observable<AssetTheftAlert[]> {
    return this.http.get<AssetTheftAlert[]>(`${this.baseUrl}/alerts`);
  }

  // PUT: Update Alert Status
  updateStatus(req: UpdateStatusRequest): Observable<any> {
    const params = new HttpParams()
      .set('alertId', req.alertId)
      .set('newStatus', req.newStatus)
      .set('comments', req.comments || '');

    return this.http.put(`${this.baseUrl}/update-status`, {}, { params });
  }
}
