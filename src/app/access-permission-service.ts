import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccessPermission {
  permissionId?: number;
  designationId?: number;
  designationName?: string;
  userId?: number | null;
  accessPointId: number;
  locationName?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AccessPermissionService {
  private apiUrl = 'https://localhost:44372/api/AccessPermission';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AccessPermission[]> {
    return this.http.get<AccessPermission[]>(this.apiUrl);
  }

  getById(id: number): Observable<AccessPermission> {
    return this.http.get<AccessPermission>(`${this.apiUrl}/${id}`);
  }

  create(permission: AccessPermission): Observable<AccessPermission> {
    return this.http.post<AccessPermission>(this.apiUrl, permission);
  }

  update(permission: AccessPermission): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${permission.permissionId}`, permission);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
