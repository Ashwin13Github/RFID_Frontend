import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../environments/environments';
import { SignalRupdateService } from './signal-rupdate';

export interface RfidLog {
  uid: string;
  fullName: string;
  location: string;
  action: string;
  timestamp: string;
  designation: string;
  classOrDept: string;
}

@Injectable({
  providedIn: 'root'
})
export class filtering {
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private signalRService: SignalRupdateService
  ) {}

  getFilteredLogs(
    location?: string,
    action?: string,
    uidOrName?: string,
    fromDate?: string,
    toDate?: string,
    designation?: string,
    classOrDept?: string
  ): Observable<RfidLog[]> {

    let params = new HttpParams();

    if (location) params = params.set('location', location);
    if (action) params = params.set('action', action);
    if (uidOrName) params = params.set('uidOrName', uidOrName);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    if (designation) params = params.set('designation', designation);
    if (classOrDept) params = params.set('classOrDept', classOrDept);

    return this.http.get<any[]>(`${this.baseUrl}/api/Values/filter`, { params })
      .pipe(        tap(res => console.log("Raw backend response:", res)),

        map((logs: any[]) =>
          logs.map(l => ({
            uid: l.uid ?? l.UID ?? "",
            fullName: l.fullName ?? l.FullName ?? "",
            location: l.location ?? l.Location ?? "",
            action: l.action ?? l.Action ?? "",
            timestamp: l.timestamp ?? l.Timestamp ?? "",
            designation: l.designation ?? l.Designation ?? "",
            classOrDept:
              l.classordept ??
              l.classOrDept ??
              l.ClassOrDept ??
              l["class/dept"] ??
              ""
          }))
        ),

        tap(mapped => this.signalRService.setInitialLogs(mapped))
      );
  }
}

