// filtering.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
export class filtering {
  private baseUrl = 'https://localhost:44372/api/Values/filter';

  constructor(private http: HttpClient) {}

  getFilteredLogs(
    location?: string,
    action?: string,
    uidOrName?: string, //  Combined filter
    fromDate?: string,
    toDate?: string
  ): Observable<RfidLog[]> {
    let params = new HttpParams();

    if (location) params = params.set('location', location);
    if (action) params = params.set('action', action);
    if (uidOrName) params = params.set('uidOrName', uidOrName); 
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<RfidLog[]>(this.baseUrl, { params });
  }
}
