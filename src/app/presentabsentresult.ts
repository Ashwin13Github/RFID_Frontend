// src/app/services/present-absent.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PresenceSummary {
  totalUsers: number;
  presentCount: number;
  absentCount: number;
  percentagePresent: number;
}

export interface User {
  userId: string;
  fullName: string;
  designationName: string;
}

export interface PresentAbsentResult {
  summary: PresenceSummary;
  presentUsers: User[];
  absentUsers: User[];
}

@Injectable({
  providedIn: 'root'
})
export class PresentAbsentService {

  private apiUrl = 'https://localhost:44372/api/PresentAbsentList'; // Your API URL

  constructor(private http: HttpClient) { }

  getPresentAbsentList(date: string): Observable<PresentAbsentResult> {
    return this.http.get<PresentAbsentResult>(`${this.apiUrl}?date=${date}`);
  }
}
