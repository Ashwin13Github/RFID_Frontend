import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RfidLog {
  uid: string;
  name: string;
  location: string;
  action: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class RfidLogsService {
  private baseUrl = 'https://localhost:44372/api/Values/filter';

  constructor(private http: HttpClient) {}

  // Matches your backend parameters exactly
  getFilteredLogs(
    location?: string,
    action?: string,
    uidOrName?: string,
    fromDate?: string,
    toDate?: string
  ): Observable<RfidLog[]> {
    let url = this.baseUrl;
    const params = new URLSearchParams();

    if (location) params.append('location', location);
    if (action) params.append('action', action);
    if (uidOrName) params.append('uidOrName', uidOrName); // ✅ matches backend
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    if (params.toString()) {
      url += '?' + params.toString();
    }

    console.log('🔍 Filter API URL:', url); // Debug URL
    return this.http.get<RfidLog[]>(url);
  }
}
