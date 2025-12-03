import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44372/api/Auth';
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    let user = localStorage.getItem('currentUser');
    if (!user) {
      user = sessionStorage.getItem('currentUser');
    }
    return user ? JSON.parse(user).token : null;
  }

  getCurrentUser() {
    const localStorageUser = localStorage.getItem('currentUser');
    const sessionStorageUser = sessionStorage.getItem('currentUser');
    console.log('Raw localStorageUser:', localStorageUser);
    console.log('Raw sessionStorageUser:', sessionStorageUser);

    let user = localStorageUser;
    if (!user) {
      user = sessionStorageUser;
    }

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        // Check if the token has expired
        const expiresAt = new Date(parsedUser.expiresAt);
        if (expiresAt < new Date()) {
          console.log('Token has expired, clearing user from storage.');
          localStorage.removeItem('currentUser');
          sessionStorage.removeItem('currentUser');
          return null; // Token expired, user is no longer authenticated
        }
        console.log('Parsed user from storage:', parsedUser);
        return parsedUser;
      } catch (e) {
        console.error('Error parsing user from storage:', e);
        return null;
      }
    }
    console.log('getCurrentUser returning null (no user in storage).');
    return null;
  }
}
