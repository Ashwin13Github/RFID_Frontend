// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environments';

// export interface RfidLog {
//   uid: string;
//   fullName: string;
//   location: string;
//   action: string;
//   timestamp: string;
//   designation: string;
//   classOrDept: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class RfidLogsService {


//   //private baseUrl='http://rfid-app.runasp.net/api/Values/filter'
//   private baseUrl = environment.baseUrl
//   constructor(private http: HttpClient) {}

//   // Matches your backend parameters exactly
//   getFilteredLogs(
//     location?: string,
//     action?: string,
//     uidOrName?: string,
//     fromDate?: string,
//     toDate?: string,
//     designation?: string,
//     classOrDept?: string
//   ): Observable<RfidLog[]> {
//     let url = `${this.baseUrl}/api/Values/filter`;
//     const params = new URLSearchParams();

//     if (location) params.append('location', location);
//     if (action) params.append('action', action);
//     if (uidOrName) params.append('uidOrName', uidOrName); //  matches backend
//     if (fromDate) params.append('fromDate', fromDate);
//     if (toDate) params.append('toDate', toDate);
//     if (designation) params.append('designation', designation);
//     if (classOrDept) params.append('classOrDept', classOrDept);

//     if (params.toString()) {
//       url += '?' + params.toString();
//     }

//     console.log(' Filter API URL:', url); // Debug URL
//     return this.http.get<RfidLog[]>(url);
//   }
// }
