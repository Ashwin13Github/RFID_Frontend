import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignalRupdateService } from './signal-rupdate';

export interface Person {
  uid: string;
  name: string | null;
  action: string;
  location: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private baseUrl = 'https://localhost:44372/api/Values/users-at-location';

  constructor(private http: HttpClient, private signalRService: SignalRupdateService) {}

  getPeopleAtLocation(location: string): Observable<Person[]> {
    const url = `${this.baseUrl}?location=${encodeURIComponent(location)}`;
    console.log(' Fetching people at location:', url);
    return this.http.get<Person[]>(url);
  }

  getPeopleUpdates(): Observable<Person[]> {
    return this.signalRService.newPeople$;
  }
}
