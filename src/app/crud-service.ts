import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private apiUrl = 'https://localhost:44372/api/CRUDController1';

  constructor(private http: HttpClient) {}

  // ===== DESIGNATION =====
  getAllDesignations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDesignations`);
  }

  createDesignation(designation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createDesignation`, designation);
  }

  updateDesignation(designation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateDesignation`, designation);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteDesignation/${id}`);
  }

  // ===== USER =====
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUsers`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUser`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`);
  }

  // ===== USER UID =====
  getAllUserUIDs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUserUIDs`);
  }

  createUserUID(userUID: any): Observable<any> {
    // Ensure correct backend field casing
    return this.http.post(`${this.apiUrl}/createUserUID`, userUID);
  }

  updateUserUID(userUID: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUserUID`, userUID);
  }

  deleteUserUID(uid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUserUID/${uid}`);
  }
}
