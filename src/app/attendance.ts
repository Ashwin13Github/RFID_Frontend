import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

export interface AttendanceRecord {
  uid: string;
  fullName: string;
  attendanceDate?: string;
  firstIn: string;
  lastOut: string;
  totalHoursFormatted: string;
}

export interface TotalInTime {
  uid: string;
  userId: number;
  fullName: string;
  designation?: string | null;
  attendanceDate: string | null;
  firstIn: string | null;
  lastOut: string | null;
  totalWorkedTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTotalInTime(uid?: string, date?: string): Observable<TotalInTime[]> {
    let url = `${this.baseUrl}/api/TotalInTime`;

    const params = [];
    if (uid) params.push(`uid=${uid}`);
    if (date) params.push(`date=${date}`);

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<TotalInTime[]>(url);
  }
}
